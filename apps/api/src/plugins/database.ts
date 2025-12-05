import fp from 'fastify-plugin'
import mongoose from 'mongoose'

import { env } from '../config'

export default fp(async (_app) => {
  try {
    if (mongoose.connection.readyState < 1) {
      await mongoose.connect(env.DATABASE_URL)
      // @TODO: use shared logger? another logger lib?
      console.log('MongoDB connected')
    }
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`)
    throw error
  }
})
