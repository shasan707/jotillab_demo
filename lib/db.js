import { neon } from '@neondatabase/serverless'

/* Neon Postgres (Vercel Marketplace) client for intake submissions.
   Lazily initialized: DATABASE_URL may be absent at build time or on
   environments without the integration, and nothing here may crash
   `next build` or a request when it is. Callers treat a null client
   as "storage unavailable" and degrade gracefully. */

let _sql = null
let _tableReady = null

function getSql() {
  if (!process.env.DATABASE_URL) return null
  if (!_sql) _sql = neon(process.env.DATABASE_URL)
  return _sql
}

async function ensureTable(sql) {
  if (!_tableReady) {
    _tableReady = sql`
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
  }
  try {
    await _tableReady
  } catch (err) {
    _tableReady = null
    throw err
  }
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
