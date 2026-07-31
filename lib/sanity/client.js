import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/env'

/* Lazy singleton. Returns null when Sanity is unconfigured so callers can
   degrade gracefully (empty blog) instead of crashing the build. */
let client
export function getSanityClient() {
  if (client) return client
  if (!projectId) return null
  client = createClient({ projectId, dataset, apiVersion, useCdn: true })
  return client
}
