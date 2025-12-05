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

export const ISODate = z.iso.datetime({ offset: true }).brand<'ISODate'>()
export type ISODate = z.infer<typeof ISODate>

export const ListResponse = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
  })

export const ItemResponse = <T extends z.ZodTypeAny>(item: T) => z.object({ data: item })
