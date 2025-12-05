import AutoLoad from '@fastify/autoload'
import cookie from '@fastify/cookie'
import jwt from '@fastify/jwt'
import Fastify, { type FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import path from 'path'
import { fileURLToPath } from 'url'

import { env } from './config'
import dbConnector from './plugins/database'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createServer = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  await app.register(dbConnector)

  await app.register(cookie)

  await app.register(jwt, {
    secret: env.JWT_ACCESS_SECRET,
  })

  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
  })

  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
  })

  return app
}
