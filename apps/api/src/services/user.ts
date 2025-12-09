import bcrypt from 'bcryptjs'
import { QueryFilter } from 'mongoose'

import { UserDTO } from '@repo/schemas'
import { toUserDTO, UserModel, type IUser } from '../models/User'

export async function createUser(email: string, password: string): Promise<UserDTO> {
  const existing = await UserModel.findOne({ email }).exec()
  if (existing) {
    //@TODO: improve error handling
    throw new Error('EMAIL_ALREADY_IN_USE')
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = new UserModel({ email, password: hashed })
  await user.save()
  return toUserDTO(user)
}

export async function findUser(query: QueryFilter<IUser>): Promise<UserDTO | null> {
  const user = await UserModel.findOne(query).exec()
  return user ? toUserDTO(user) : null
}

export async function verifyUserPassword(user: UserDTO, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password)
}

export async function updateUser(id: string, updates: Partial<IUser>): Promise<UserDTO | null> {
  const user = await UserModel.findOneAndUpdate(
    { _id: id },
    { $set: updates },
    { new: true }
  ).exec()
  return user ? toUserDTO(user) : null
}
