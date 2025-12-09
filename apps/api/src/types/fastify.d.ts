import 'fastify'
import { Connection } from 'mongoose'
import { UserService } from '../services/user.service'
import { Env } from './env'

declare module 'fastify' {
  interface FastifyInstance {
    config: Env
    mongoose: {
      connection: Connection
    }
    services: {
      users: UserService
    }
    authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void>
  }
}
