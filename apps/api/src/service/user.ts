import { UserModel } from '../models/User'

export const userService = {
  async createUser(userData: { name: string; email: string }) {
    const newUser = new UserModel(userData)
    await newUser.save()
    return newUser
  },

  async findUsers() {
    return UserModel.find({})
  },
}
