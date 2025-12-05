// src/routes/index.ts
import { RegisterRequest, RegisterResponse } from '@repo/schemas'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { isProd } from '../../config'
import * as userService from '../../services/user'

const auth: FastifyPluginAsyncZod = async (fastify, _opts): Promise<void> => {
  fastify.post(
    '/register',
    {
      schema: {
        body: RegisterRequest,
        response: {
          201: RegisterResponse,
        },
      },
    },
    async (req, reply) => {
      const { email, password } = req.body

      //@TODO: error handling middleware
      const user = await userService.createUser(email, password)
      const accessToken = fastify.jwt.sign({ sub: user.id, type: 'access' }, { expiresIn: '15m' })
      const refreshToken = fastify.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn: '7d' })

      await userService.updateUser(user.id, { refreshToken })

      reply.setCookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        path: '/',
      })

      const data = {
        user,
        access: accessToken,
      }
      return reply.code(201).send({ data })
    }
  )
}

export default auth
