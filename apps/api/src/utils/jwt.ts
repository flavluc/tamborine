import type { FastifyReply } from 'fastify'

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
    const access = jwt.sign({ sub: userId, type: 'access' }, { expiresIn: '15m' })

    const refresh = jwt.sign({ sub: userId, type: 'refresh' }, { expiresIn: '7d' })

    return { access, refresh }
  }

  const verifyRefresh = (token: string): AuthJwtPayload => {
    const payload = jwt.verify<AuthJwtPayload>(token)
    if (payload.type !== 'refresh') {
      throw new Error('INVALID_REFRESH_TOKEN')
    }
    return payload
  }

  const verifyAccess = (token: string): AuthJwtPayload => {
    const payload = jwt.verify<AuthJwtPayload>(token)
    if (payload.type !== 'access') {
      throw new Error('INVALID_ACCESS_TOKEN')
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
