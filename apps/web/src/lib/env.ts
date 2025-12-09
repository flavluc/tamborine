import { z } from 'zod'

const Schema = z.object({
  NEXT_PUBLIC_API_URL: z.url(),
})

// These are replaced by literal values during Next.js build
export const env = Schema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})
