import fp from 'fastify-plugin'
import mongoose from 'mongoose'

export default fp(async (app) => {
  try {
    await mongoose.connect(app.config.DATABASE_URL, {
      directConnection: true,
    })
    // @TODO: use shared logger? another logger lib?
    console.log('MongoDB connected')
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`)
    throw error
  }
})
