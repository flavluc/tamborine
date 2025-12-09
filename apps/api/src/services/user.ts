import bcrypt from 'bcryptjs'

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

export async function findUserByEmail(email: string): Promise<UserDTO | null> {
  const user = await UserModel.findOne({ email }).exec()
  return user ? toUserDTO(user) : null
}

export async function verifyUserPassword(user: IUser, password: string): Promise<boolean> {
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
