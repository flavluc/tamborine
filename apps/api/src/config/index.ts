import { z } from 'zod'

export const Schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  DATABASE_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(16),
  JWT_REFRESH_SECRET: z.string().min(16),
  WEB_URL: z.url().default('http://localhost:3000'),
})

export type Env = z.infer<typeof Schema>
export const isProd = (env: Env) => env.NODE_ENV === 'production'
export const isTest = (env: Env) => env.NODE_ENV === 'test'
export const isDev = (env: Env) => env.NODE_ENV === 'development'
