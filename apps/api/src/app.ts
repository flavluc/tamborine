import AutoLoad from '@fastify/autoload'
import cookie from '@fastify/cookie'
import fenv from '@fastify/env'
import jwt from '@fastify/jwt'
import ajvFormats from 'ajv-formats'
import Fastify, { type FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import path from 'path'
import { fileURLToPath } from 'url'
import { z, ZodError } from 'zod'

import { Env, Schema } from './config'
import dbConnector from './plugins/database'
import { ApiError, apiError, badRequest, internalError } from './utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createServer = async (env: Env): Promise<FastifyInstance> => {
  // @TODO: zod 4 has native json schema conversion, should we still use type provider?
  const app = Fastify({
    logger: true,
    pluginTimeout: 30000,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.setErrorHandler((error, _req, reply) => {
    if (error instanceof ZodError) return badRequest(reply, z.treeifyError(error))

    if (error instanceof ApiError) return apiError(reply, error)

    // @TODO: add proper logging
    console.error(error)
    return internalError(reply)
  })

  await app.register(fenv, {
    schema: z.toJSONSchema(Schema, { target: 'draft-7' }),
    data: env,
    ajv: {
      customOptions: (ajvInstance) => {
        ajvFormats(ajvInstance)
        return ajvInstance
      },
    },
  })

  await app.register(dbConnector)

  await app.register(cookie)

  await app.register(jwt, {
    secret: app.config.JWT_ACCESS_SECRET,
  })

  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
  })

  await app.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
  })

  return app
}
