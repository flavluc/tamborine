import fp from 'fastify-plugin'
import mongoose from 'mongoose'

export default fp(async (app) => {
  try {
    await mongoose.connect(app.config.DATABASE_URL, {
      directConnection: true,
    })

    app.decorate('isDbReady', async () => {
      const db = mongoose.connection.db
      if (!db) return false

      await db.admin().ping()
      return true
    })

    app.log.debug('MongoDB connected')
  } catch (error) {
    app.log.error(`MongoDB connection error: ${error}`)
    throw error
  }
})
