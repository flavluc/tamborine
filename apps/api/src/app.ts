import AutoLoad from '@fastify/autoload'
import Fastify, { type FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import path from 'path'
import { fileURLToPath } from 'url'

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

  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
  })

  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
  })

  return app
}
