import { z } from 'zod'

import { Email, Password, UserName } from './primitives'
import { UserDTO } from './user'

export const RegisterRequest = z.object({
  email: Email,
  name: UserName,
  password: Password,
})
export type RegisterRequest = z.infer<typeof RegisterRequest>

export const LoginRequest = RegisterRequest.pick({
  email: true,
  password: true,
})
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
    access: z.string(), // JWT
  }),
})

export const RefreshResponse = z.object({
  data: z.object({
    user: UserDTO,
    access: z.string(),
  }),
})
