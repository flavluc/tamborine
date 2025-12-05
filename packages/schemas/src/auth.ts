import { z } from 'zod'

import { Email, Password } from './primitives'
import { UserDTO } from './user'

export const RegisterRequest = z.object({
  email: Email,
  password: Password,
})
export type RegisterRequest = z.infer<typeof RegisterRequest>

export const LoginRequest = RegisterRequest
export type LoginRequest = z.infer<typeof LoginRequest>

export const LoginResponse = z.object({
  data: z.object({
    user: UserDTO,
    access: z.string(), // JWT
  }),
})

export const RegisterResponse = z.object({
  data: z.object({
    user: UserDTO,
  }),
})

export const RefreshResponse = z.object({
  data: z.object({
    access: z.string(),
  }),
})
