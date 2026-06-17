import { z } from 'zod'

/**
 * Zod schemas mirroring the vchat backend serializers. Responses are parsed
 * through these before being mapped onto the invictus-ui domain model, so a
 * backend contract drift surfaces as a clear validation error rather than an
 * `undefined` deep in the UI.
 */

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  is_staff: z.boolean().optional(),
  created_at: z.string().optional(),
})
export type VchatUser = z.infer<typeof userSchema>

export const conversationSchema = z.object({
  id: z.number(),
  title: z.string(),
  model_name: z.string().default(''),
  skill_names: z.array(z.string()).default([]),
  workflow_name: z.string().default(''),
  created_at: z.string(),
  updated_at: z.string(),
})
export type VchatConversation = z.infer<typeof conversationSchema>
export const conversationListSchema = z.array(conversationSchema)

export const messageSchema = z.object({
  id: z.number(),
  conversation: z.number(),
  role: z.enum(['system', 'user', 'assistant']),
  content: z.string(),
  model_name: z.string().optional(),
  created_at: z.string(),
})
export type VchatMessage = z.infer<typeof messageSchema>
export const messageListSchema = z.array(messageSchema)

export const modelConfigSchema = z.object({
  id: z.number(),
  provider: z.string(),
  model_name: z.string(),
  display_name: z.string(),
  enabled: z.boolean(),
})
export type ModelConfig = z.infer<typeof modelConfigSchema>
export const modelConfigListSchema = z.array(modelConfigSchema)

export const skillSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  description: z.string().default(''),
  domain: z.string().default(''),
  enabled: z.boolean(),
})
export type Skill = z.infer<typeof skillSchema>
export const skillListSchema = z.array(skillSchema)

export const workflowFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['string', 'number', 'boolean']).optional(),
  description: z.string().optional(),
  required: z.boolean().optional(),
})

export const workflowSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: z.string(),
  description: z.string().default(''),
  fields: z.array(workflowFieldSchema).default([]),
  enabled: z.boolean(),
})
export type Workflow = z.infer<typeof workflowSchema>
export const workflowListSchema = z.array(workflowSchema)

const workflowQuestionSchema = z.object({
  id: z.string().optional(),
  // The regprofile backend emits `prompt` (+ `kind`/`options`); older/mock
  // payloads may use question/label/text. Keep them all so nothing is dropped.
  prompt: z.string().optional(),
  question: z.string().optional(),
  label: z.string().optional(),
  text: z.string().optional(),
  kind: z.enum(['single', 'multi', 'text']).optional(),
  options: z.array(z.string()).optional(),
})

export const taskStatusSchema = z.enum([
  'queued',
  'running',
  'waiting_for_answers',
  'completed',
  'failed',
])

export const workflowExecutionSchema = z.object({
  id: z.number(),
  conversation: z.number(),
  external_workflow_id: z.string().default(''),
  execution_type: z.string().default('regulatory_profile'),
  status: taskStatusSchema,
  website_url: z.string().default(''),
  status_payload: z
    .object({
      questions: z.array(workflowQuestionSchema).optional(),
      error: z.string().nullish(),
    })
    .partial()
    .default({}),
  error: z.string().default(''),
  updated_at: z.string(),
})
export type VchatWorkflowExecution = z.infer<typeof workflowExecutionSchema>
export const workflowExecutionListSchema = z.array(workflowExecutionSchema)

export const workflowArtifactSchema = z.object({
  id: z.number(),
  conversation: z.number(),
  title: z.string(),
  artifact_type: z.enum(['spec', 'notes', 'checklist', 'regulatory_profile']).catch('regulatory_profile'),
  content: z.string().default(''),
  updated_at: z.string(),
})
export type VchatArtifact = z.infer<typeof workflowArtifactSchema>
export const workflowArtifactListSchema = z.array(workflowArtifactSchema)
