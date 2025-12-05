import * as dotenv from 'dotenv'
dotenv.config()

import { z } from 'zod'

const Schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
})

export const env = Schema.parse(process.env)
export const isProd = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
export const isDev = env.NODE_ENV === 'development'
