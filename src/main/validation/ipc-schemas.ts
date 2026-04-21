import { z } from 'zod'

export function parseIpc<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  const r = schema.safeParse(data)
  if (!r.success) {
    const msg = r.error.issues.map((e) => `${e.path.join('.') || 'root'}: ${e.message}`).join('; ')
    throw new Error(msg || 'Validation failed')
  }
  return r.data
}

export const prioritySchema = z.enum(['low', 'medium', 'high'])

export const idSchema = z.string().min(1).max(64)

export const authCredentialsSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(200),
})

export const createTaskSchema = z.object({
  title: z.string().min(1).max(500).trim(),
  priority: prioritySchema,
  dueDate: z.string().max(50).nullable().optional(),
})

export const updateTaskBodySchema = z
  .object({
    title: z.string().min(1).max(500).trim().optional(),
    priority: prioritySchema.optional(),
    completed: z.boolean().optional(),
    dueDate: z.string().max(50).nullable().optional(),
  })
  .strict()

export const tabGroupNameSchema = z.string().min(1).max(200).trim()

export const tabGroupAddTabSchema = z.object({
  groupId: idSchema,
  url: z.string().min(1).max(8192),
  title: z.string().max(2000),
})

export const tabThresholdSchema = z.number().int().min(1).max(3650)

export const hwndSchema = z.number().finite()

export const snapDirectionSchema = z.enum(['left', 'right'])
