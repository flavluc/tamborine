import AutoLoad from '@fastify/autoload'
import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fenv from '@fastify/env'
import jwt from '@fastify/jwt'
import ajvFormats from 'ajv-formats'
import Fastify, { type FastifyError, type FastifyInstance } from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import path from 'path'
import { fileURLToPath } from 'url'
import { z, ZodError } from 'zod'

import { Env, Schema } from './config'
import { ApiError, apiError, badRequest, fastifyError, internalError } from './utils'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const createServer = async (env: Env): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: true,
  }).withTypeProvider<ZodTypeProvider>()

  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.setErrorHandler((error, _req, reply) => {
    //@TODO: add proper logging
    console.error(error)

    if (error instanceof ZodError) return badRequest(reply, z.treeifyError(error))

    if (error instanceof ApiError) return apiError(reply, error)

    const ferror = error as FastifyError
    if ('code' in ferror && ferror.code.startsWith('FST_')) return fastifyError(reply, ferror)

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

  await app.register(cookie)

  await app.register(cors, {
    origin: env.WEB_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

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
