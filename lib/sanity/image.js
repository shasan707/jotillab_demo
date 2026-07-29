import imageUrlBuilder from '@sanity/image-url'
import { projectId, dataset } from '@/sanity/env'

let builder
export function urlFor(source) {
  if (!builder) {
    if (!projectId) return null
    builder = imageUrlBuilder({ projectId, dataset })
  }
  return builder.image(source)
}
