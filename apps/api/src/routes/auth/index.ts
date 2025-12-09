import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import {
  ErrorEnvelope,
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '@repo/schemas'
import { isProd } from '../../config'
import * as userService from '../../services/user'
import {
  clearRefreshTokenCookie,
  createJwtHelpers,
  Errors,
  setRefreshTokenCookie,
} from '../../utils'

const auth: FastifyPluginAsyncZod = async (fastify, _opts): Promise<void> => {
  const { issueTokens, verifyRefresh } = createJwtHelpers(fastify.jwt)

  fastify.post(
    '/register',
    {
      schema: {
        body: RegisterRequest,
        response: {
          201: RegisterResponse,
          '4xx': ErrorEnvelope,
          '5xx': ErrorEnvelope,
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
          '4xx': ErrorEnvelope,
          '5xx': ErrorEnvelope,
        },
      },
    },
    async (req, reply) => {
      const { email, password } = req.body

      const userDoc = await userService.findUser({ email })
      if (!userDoc) {
        throw Errors.Auth.InvalidCredentials()
      }

      const ok = await userService.verifyUserPassword(userDoc, password)
      if (!ok) {
        throw Errors.Auth.InvalidCredentials()
      }

      const userId = userDoc.id
      const tokens = issueTokens(userId)
      const user = await userService.updateUser(userId, { refreshToken: tokens.refresh })
      if (!user) {
        throw Errors.Auth.InvalidCredentials()
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
          '4xx': ErrorEnvelope,
          '5xx': ErrorEnvelope,
        },
      },
    },
    async (req, reply) => {
      const cookieToken = req.cookies.refreshToken as string | undefined
      if (!cookieToken) {
        throw Errors.Auth.MissingToken()
      }

      const payload = verifyRefresh(cookieToken)
      const userId = payload.sub
      const tokens = issueTokens(userId)

      const user = await userService.updateUser(userId, { refreshToken: tokens.refresh })
      if (!user) {
        throw Errors.Auth.InvalidCredentials()
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
      schema: {
        response: {
          '4xx': ErrorEnvelope,
          '5xx': ErrorEnvelope,
        },
      },
    },
    async (req, reply) => {
      const cookieToken = req.cookies.refreshToken

      if (cookieToken) {
        try {
          const payload = verifyRefresh(cookieToken)
          const userId = payload.sub
          await userService.updateUser(userId, { refreshToken: null })
        } finally {
          clearRefreshTokenCookie(reply)
        }
      }

      return reply.code(204).send()
    }
  )
}

export default auth
