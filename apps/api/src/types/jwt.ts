export interface JwtPayload {
  sub: string
  type: 'access' | 'refresh'
  jti: string
}
