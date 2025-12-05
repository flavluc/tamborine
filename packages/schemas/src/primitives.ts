import { z } from 'zod'

export const Id = z.uuid().brand<'Id'>()
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
