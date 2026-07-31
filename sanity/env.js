/* Sanity connection constants. Public values only: the dataset has public
   read access, so no token is needed for page rendering. */

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = '2026-07-01'
