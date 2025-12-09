import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '@repo/schemas'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { clearRefreshTokenCookie, createJwtHelpers, setRefreshTokenCookie } from '../../utils'

import { isProd } from '../../config'
import * as userService from '../../services/user'
const auth: FastifyPluginAsyncZod = async (fastify, _opts): Promise<void> => {
  const { issueTokens, verifyRefresh } = createJwtHelpers(fastify.jwt)

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

      const user = await userService.createUser(email, password)
      const tokens = issueTokens(user.id)

      await userService.updateUser(user.id, { refreshToken: tokens.refresh })

      setRefreshTokenCookie(reply, tokens.refresh, isProd(fastify.config))

      return reply.code(201).send({
        data: {
          user,
          access: tokens.access,
        },
      })
    }
  )

  fastify.post(
    '/login',
    {
      schema: {
        body: LoginRequest,
        response: {
          200: LoginResponse,
        },
      },
    },
    async (req, reply) => {
      const { email, password } = req.body

      const userDoc = await userService.findUser({ email })
      if (!userDoc) {
        throw new Error('INVALID_CREDENTIALS')
      }

      const ok = await userService.verifyUserPassword(userDoc, password)
      if (!ok) {
        throw new Error('INVALID_CREDENTIALS')
      }

      const userId = userDoc.id
      const tokens = issueTokens(userId)

      const user = await userService.updateUser(userId, { refreshToken: tokens.refresh })
      if (!user) {
        throw new Error('USER_NOT_FOUND')
      }

      setRefreshTokenCookie(reply, tokens.refresh, isProd(fastify.config))

      return reply.code(200).send({
        data: {
          user,
          access: tokens.access,
        },
      })
    }
  )

  fastify.post(
    '/refresh',
    {
      schema: {
        response: {
          200: RefreshResponse,
        },
      },
    },
    async (req, reply) => {
      const cookieToken = req.cookies.refreshToken as string | undefined
      if (!cookieToken) {
        throw new Error('MISSING_REFRESH_TOKEN')
      }

      const payload = verifyRefresh(cookieToken)
      const userId = payload.sub

      const tokens = issueTokens(userId)

      const user = await userService.updateUser(userId, { refreshToken: tokens.refresh })
      if (!user) {
        throw new Error('USER_NOT_FOUND')
      }

      setRefreshTokenCookie(reply, tokens.refresh, isProd(fastify.config))

      return reply.code(200).send({
        data: {
          access: tokens.access,
        },
      })
    }
  )

  fastify.post(
    '/logout',
    {
      schema: {},
    },
    async (req, reply) => {
      const cookieToken = req.cookies.refreshToken

      if (cookieToken) {
        try {
          const payload = verifyRefresh(cookieToken)
          const userId = payload.sub
          await userService.updateUser(userId, { refreshToken: undefined })
        } catch {
          // ignore errors on logout
        }
      }

      clearRefreshTokenCookie(reply)

      return reply.code(204).send()
    }
  )
}

export default auth
