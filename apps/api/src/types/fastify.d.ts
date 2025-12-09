import { Connection } from 'mongoose' // Mongoose connection type
import { UserService } from '../services/user.service' // Your functional service type
import { Env } from './env' // Your Zod/Env type

declare module 'fastify' {
  interface FastifyInstance {
    config: Env
    mongoose: {
      connection: Connection
    }
    services: {
      users: UserService
    }
  }
}
