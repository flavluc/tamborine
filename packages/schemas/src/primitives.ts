import { z } from 'zod'

const MONGO_OBJECT_ID_REGEX = /^[a-fA-F0-9]{24}$/

export const Id = z
  .string()
  .refine(
    (val) => {
      return MONGO_OBJECT_ID_REGEX.test(val)
    },
    {
      message: 'Invalid MongoDB ObjectId format (must be a 24-character hex string)',
    }
  )
  .brand<'Id'>()
export type Id = z.infer<typeof Id>

export const Email = z.email()
export const Password = z.string().min(6).max(128)

export const UserName = z.string().min(2, 'Name too short').max(80, 'Name too long')

export const ISODate = z.iso.datetime({ offset: true }).brand<'ISODate'>()
export type ISODate = z.infer<typeof ISODate>

export const ItemResponse = <T extends z.ZodTypeAny>(item: T) => z.object({ data: item })

export const ListResponse = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    total: z.number().int().nonnegative(),
  })

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

export const ErrorCode = z.enum([
  'VALIDATION_ERROR',
  'AUTH_INVALID_CREDENTIALS',
  'AUTH_MISSING_TOKEN',
  'AUTH_TOKEN_EXPIRED',
  'AUTH_TOKEN_REUSED',
  'AUTH_FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'INTERNAL',
])
export type ErrorCode = z.infer<typeof ErrorCode>

export const ErrorEnvelope = z.object({
  error: z.object({
    code: ErrorCode,
    message: z.string(),
    details: z.unknown().optional(),
  }),
})
export type ErrorEnvelope = z.infer<typeof ErrorEnvelope>
