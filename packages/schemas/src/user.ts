import { z } from 'zod'

import { Email, Id, ISODate, ItemResponse, ListResponse, Password } from './primitives'

export const UserDTO = z.object({
  id: Id,
  email: Email,
  password: Password,
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type UserDTO = z.infer<typeof UserDTO>
export const UserItem = ItemResponse(UserDTO)
export const UserList = ListResponse(UserDTO)
