import { BLOG_CATEGORIES } from '../../data/blogCategories'

/* The shared content contract for both sites. Slugs are immutable after
   publishing: blog comments live in Redis keyed by slug, and both sites
   build their post URLs from it. */

export const SITE_OPTIONS = [
  { title: 'JotilLabs', value: 'jotillabs' },
  { title: 'Site B', value: 'site-b' },
]

const post = {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(120),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description:
        'Never change after publishing. Comments and both sites\' URLs are keyed by slug.',
      options: { source: 'title', maxLength: 80 },
      validation: (rule) =>
        rule.required().custom((value) => {
          const current = value?.current || ''
          return /^[a-z0-9-]+$/.test(current)
            ? true
            : 'Lowercase letters, numbers, and hyphens only'
        }),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on cards and in search results.',
      validation: (rule) => rule.required().min(10).max(300),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      initialValue: 'JotilLabs Team',
      validation: (rule) => rule.required().min(2).max(60),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: { list: BLOG_CATEGORIES, layout: 'dropdown' },
      validation: (rule) => rule.required(),
    },
    {
      name: 'date',
      title: 'Publish date',
      type: 'date',
      options: { dateFormat: 'YYYY-MM-DD' },
      validation: (rule) => rule.required(),
    },
    {
      name: 'mainImage',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
    },
    {
      name: 'sites',
      title: 'Show on sites',
      type: 'array',
      of: [{ type: 'string' }],
      options: { list: SITE_OPTIONS },
      initialValue: ['jotillabs', 'site-b'],
      validation: (rule) => rule.required().min(1),
    },
    {
      name: 'canonicalSite',
      title: 'Canonical site',
      type: 'string',
      description:
        'When a post shows on both sites, search engines credit this one.',
      options: { list: SITE_OPTIONS, layout: 'radio' },
      initialValue: 'jotillabs',
      validation: (rule) => rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bulleted', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                name: 'link',
                title: 'Link',
                type: 'object',
                fields: [
                  {
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (rule) =>
                      rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', title: 'Alt text', type: 'string' }],
        },
        {
          name: 'video',
          title: 'Video',
          type: 'object',
          fields: [
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description: 'Direct link to an mp4/webm file (existing media library URLs work).',
            },
            { name: 'file', title: 'Or upload a file', type: 'file', options: { accept: 'video/mp4,video/webm' } },
            { name: 'title', title: 'Title', type: 'string' },
          ],
          preview: {
            select: { title: 'title', url: 'url' },
            prepare({ title, url }) {
              return { title: title || 'Video', subtitle: url || 'Uploaded file' }
            },
          },
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'object',
          fields: [
            {
              name: 'id',
              title: 'YouTube video ID',
              type: 'string',
              description: 'The 11-character ID, e.g. dQw4w9WgXcQ.',
              validation: (rule) => rule.required(),
            },
            { name: 'title', title: 'Title', type: 'string' },
          ],
          preview: {
            select: { id: 'id', title: 'title' },
            prepare({ id, title }) {
              return { title: title || 'YouTube video', subtitle: id }
            },
          },
        },
        { type: 'code' },
      ],
      validation: (rule) => rule.required(),
    },
  ],
  orderings: [
    {
      title: 'Publish date, newest first',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'category', media: 'mainImage' },
  },
}

export default post
