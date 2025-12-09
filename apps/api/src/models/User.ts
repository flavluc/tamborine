import { ISODate, Id, UserDTO } from '@repo/schemas'
import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose'

export interface IUser {
  email: string
  password: string // hashed
  refreshToken?: string | null
  createdAt: Date
  updatedAt: Date
}

export type UserDocument = HydratedDocument<IUser>

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

export const UserModel: Model<IUser> =
  (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema)

export function toUserDTO(user: UserDocument): UserDTO {
  return {
    id: Id.parse(user._id.toString()),
    email: user.email,
    password: user.password,
    createdAt: ISODate.parse(user.createdAt.toISOString()),
    updatedAt: ISODate.parse(user.updatedAt.toISOString()),
  }
}
