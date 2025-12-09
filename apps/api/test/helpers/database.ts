import { MongoDBContainer } from '@testcontainers/mongodb'
import mongoose from 'mongoose'

const TEST_DATABASE = 'integration-test-db'
const MONGO_IMAGE = 'mongo:8.0'

export type MongoTestContainer = {
  uri: string
  close: () => Promise<void>
  clear: () => Promise<void>
}

export const withDatabase = async () => {
  const container = await new MongoDBContainer(MONGO_IMAGE).start()
  const uri = `${container.getConnectionString()}/${TEST_DATABASE}`

  const close = async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase()
      await mongoose.disconnect()
    }
    await container.stop()
  }

  const clear = async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
      const collection = collections[key]
      await collection.deleteMany({})
    }
  }

  return {
    uri,
    close,
    clear,
  }
}
