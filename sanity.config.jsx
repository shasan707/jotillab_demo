'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { projectId, dataset, apiVersion } from './sanity/env'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'jotillabs',
  title: 'JotilLabs Blog',
  basePath: '/studio',
  projectId: projectId || 'missing-project-id',
  dataset,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion }), codeInput()],
  schema: { types: schemaTypes },
})
