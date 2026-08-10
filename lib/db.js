import { neon } from '@neondatabase/serverless'

/* Neon Postgres (Vercel Marketplace) client for intake and contact
   submissions. Lazily initialized: DATABASE_URL may be absent at build
   time or on environments without the integration, and nothing here may
   crash `next build` or a request when it is. Callers treat a null
   client as "storage unavailable" and degrade gracefully. */

let _sql = null
let _tableReady = null
let _contactTableReady = null

function getSql() {
  if (!process.env.DATABASE_URL) return null
  if (!_sql) _sql = neon(process.env.DATABASE_URL)
  return _sql
}

async function ensureTable(sql) {
  if (!_tableReady) {
    _tableReady = (async () => {
      await sql`
        CREATE TABLE IF NOT EXISTS intake_submissions (
          id serial PRIMARY KEY,
          slug text NOT NULL,
          industry_name text NOT NULL,
          business_name text,
          contact_name text,
          contact_email text,
          contact_phone text,
          answers jsonb NOT NULL,
          created_at timestamptz NOT NULL DEFAULT now()
        )
      `
      /* Partial-lead columns for the guided chat intake. Idempotent so a
         pre-existing production table gains them on first use; existing
         rows correctly default to 'complete'. */
      await sql`ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'complete'`
      await sql`ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now()`
      await sql`ALTER TABLE intake_submissions ADD COLUMN IF NOT EXISTS submission_key text`
    })()
  }
  try {
    await _tableReady
  } catch (err) {
    _tableReady = null
    throw err
  }
}

async function ensureContactTable(sql) {
  if (!_contactTableReady) {
    _contactTableReady = sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id serial PRIMARY KEY,
        name text NOT NULL,
        email text NOT NULL,
        company text,
        phone text,
        inquiry_type text,
        message text NOT NULL,
        demo_slot text,
        demo_iso text,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `
  }
  try {
    await _contactTableReady
  } catch (err) {
    _contactTableReady = null
    throw err
  }
}

/* Creates a partial lead as soon as the chat has the contact block.
   Returns { id, key } for later updates, or null when Postgres is not
   configured. The key is an unguessable stored secret: only the browser
   that created the lead can update it. Throws on a real database error. */
export async function createIntakeLead({ slug, industryName, answers }) {
  const sql = getSql()
  if (!sql) return null
  await ensureTable(sql)
  const key = crypto.randomUUID()
  const [row] = await sql`
    INSERT INTO intake_submissions
      (slug, industry_name, business_name, contact_name, contact_email, contact_phone,
       answers, status, submission_key)
    VALUES
      (${slug}, ${industryName}, ${answers.business_name || null},
       ${answers.contact_name || null}, ${answers.contact_email || null},
       ${answers.contact_phone || null}, ${JSON.stringify(answers)},
       'partial', ${key})
    RETURNING id
  `
  return { id: row.id, key }
}

/* Updates a partial lead with the accumulated answers; `complete: true`
   marks it finished. Only rows still in 'partial' with a matching key can
   change, which is both the anti-tamper guard and the email dedup: a
   completed row never flips back. Returns 'updated', 'completed' (the row
   was already finished by this same key, a double submit), or 'not_found'
   (unknown id or wrong key). */
export async function updateIntakeLead({ id, key, answers, industryName, complete = false }) {
  const sql = getSql()
  if (!sql) return 'not_found'
  await ensureTable(sql)
  const updated = await sql`
    UPDATE intake_submissions
    SET answers = ${JSON.stringify(answers)},
        industry_name = ${industryName},
        business_name = ${answers.business_name || null},
        contact_name = ${answers.contact_name || null},
        contact_email = ${answers.contact_email || null},
        contact_phone = ${answers.contact_phone || null},
        status = ${complete ? 'complete' : 'partial'},
        updated_at = now()
    WHERE id = ${id} AND submission_key = ${key} AND status = 'partial'
    RETURNING id
  `
  if (updated.length > 0) return 'updated'
  const [existing] = await sql`
    SELECT status FROM intake_submissions
    WHERE id = ${id} AND submission_key = ${key}
  `
  return existing?.status === 'complete' ? 'completed' : 'not_found'
}

/* Returns true when the row was stored, false when Postgres is not
   configured. Throws on a real database error so the caller can log it. */
export async function saveIntakeSubmission({ slug, industryName, answers }) {
  const sql = getSql()
  if (!sql) return false
  await ensureTable(sql)
  await sql`
    INSERT INTO intake_submissions
      (slug, industry_name, business_name, contact_name, contact_email, contact_phone, answers)
    VALUES
      (${slug}, ${industryName}, ${answers.business_name || null},
       ${answers.contact_name || null}, ${answers.contact_email || null},
       ${answers.contact_phone || null}, ${JSON.stringify(answers)})
  `
  return true
}

export async function saveContactSubmission({
  name,
  email,
  company,
  phone,
  inquiryType,
  message,
  demoSlot,
  demoISO,
}) {
  const sql = getSql()
  if (!sql) return false
  await ensureContactTable(sql)
  await sql`
    INSERT INTO contact_submissions
      (name, email, company, phone, inquiry_type, message, demo_slot, demo_iso)
    VALUES
      (${name}, ${email}, ${company || null}, ${phone || null},
       ${inquiryType || null}, ${message}, ${demoSlot || null}, ${demoISO || null})
  `
  return true
}

/* List functions for the admin panel. Return null when Postgres is not
   configured (callers turn that into a 503). */
export async function listIntakeSubmissions({ limit = 50, offset = 0 } = {}) {
  const sql = getSql()
  if (!sql) return null
  await ensureTable(sql)
  const rows = await sql`
    SELECT id, slug, industry_name, business_name, contact_name,
           contact_email, contact_phone, answers, status, created_at, updated_at
    FROM intake_submissions
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM intake_submissions`
  return { rows, total: count }
}

export async function listContactSubmissions({ limit = 50, offset = 0 } = {}) {
  const sql = getSql()
  if (!sql) return null
  await ensureContactTable(sql)
  const rows = await sql`
    SELECT id, name, email, company, phone, inquiry_type, message,
           demo_slot, demo_iso, created_at
    FROM contact_submissions
    ORDER BY created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM contact_submissions`
  return { rows, total: count }
}
