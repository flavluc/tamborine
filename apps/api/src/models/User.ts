import { ISODate, Id, UserDTO } from '@repo/schemas'
import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string // hashed
  refreshToken?: string | null
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
)

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)

export function toUserDTO(user: IUser): UserDTO {
  return {
    id: Id.parse(user._id.toString()),
    email: user.email,
    password: user.password,
    createdAt: ISODate.parse(user.createdAt.toISOString()),
    updatedAt: ISODate.parse(user.updatedAt.toISOString()),
  }
}
