import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { RegisterRequest } from '@repo/schemas'

const example: FastifyPluginAsyncZod = async (fastify, _opts): Promise<void> => {
  fastify.post(
    '/register',
    {
      schema: {
        body: RegisterRequest,
      },
    },
    async (req, _res) => {
      const { email, password } = req.body
      return { email, password }
    }
  )
  fastify.get('/login', async (_req, _res) => {
    return 'ok'
  })
  fastify.get('/refresh', async (_req, _res) => {
    return 'ok'
  })
  fastify.get('/logout', async (_req, _res) => {
    return 'ok'
  })
}

export default example
