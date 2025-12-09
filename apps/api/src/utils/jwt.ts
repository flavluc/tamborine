import type { JWT } from '@fastify/jwt'
import { randomUUID } from 'crypto'
import type { FastifyReply } from 'fastify'
import type { JwtPayload } from '../types/jwt'

import { Errors } from '../utils'

export function createJwtHelpers(jwt: JWT) {
  const issueTokens = (userId: string) => {
    const access = jwt.sign(
      { sub: userId, type: 'access', jti: randomUUID() },
      { expiresIn: '15m' }
    )

    const refresh = jwt.sign(
      { sub: userId, type: 'refresh', jti: randomUUID() },
      { expiresIn: '7d' }
    )

    return { access, refresh }
  }

  const verifyRefresh = (token: string): JwtPayload => {
    let payload: JwtPayload

    try {
      payload = jwt.verify<JwtPayload>(token)
    } catch {
      throw Errors.Auth.TokenExpired()
    }

    if (payload.type !== 'refresh') {
      throw Errors.Auth.TokenExpired()
    }

    return payload
  }

  return {
    issueTokens,
    verifyRefresh,
  }
}

export function setRefreshTokenCookie(reply: FastifyReply, token: string, secure: boolean) {
  reply.setCookie('refreshToken', token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
  })
}

export function clearRefreshTokenCookie(reply: FastifyReply) {
  reply.clearCookie('refreshToken', { path: '/' })
}
