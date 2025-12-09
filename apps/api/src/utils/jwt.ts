import { randomUUID } from 'crypto'
import type { FastifyReply } from 'fastify'

import { Errors } from '../utils'

export type TokenType = 'access' | 'refresh'

export interface AuthJwtPayload {
  sub: string
  type: TokenType
  iat: number
  exp: number
}

export interface JwtPort {
  sign: (payload: object, options?: { expiresIn?: string }) => string
  verify: <T = AuthJwtPayload>(token: string) => T
}

export function createJwtHelpers(jwt: JwtPort) {
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

  const verifyRefresh = (token: string): AuthJwtPayload => {
    let payload
    try {
      payload = jwt.verify<AuthJwtPayload>(token)
    } catch {
      throw Errors.Auth.TokenExpired()
    }
    if (payload.type !== 'refresh') {
      throw Errors.Auth.TokenExpired()
    }
    return payload
  }

  const verifyAccess = (token: string): AuthJwtPayload => {
    let payload
    try {
      payload = jwt.verify<AuthJwtPayload>(token)
    } catch {
      throw Errors.Auth.TokenExpired()
    }
    if (payload.type !== 'access') {
      throw Errors.Auth.TokenExpired()
    }
    return payload
  }

  return { issueTokens, verifyRefresh, verifyAccess }
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
