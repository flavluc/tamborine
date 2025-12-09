import { FastifyInstance } from 'fastify'
import { UserModel } from '../../src/models/User'
import { MongoTestContainer, withDatabase, withServer } from '../helpers'

describe('Authentication Integration', () => {
  let app: FastifyInstance
  let container: MongoTestContainer

  beforeAll(async () => {
    container = await withDatabase()
    app = await withServer(container.uri)
  })

  afterAll(async () => {
    if (app) await app.close()
    if (container) await container.close()
  })

  afterEach(async () => {
    await container.clear()
  })

  async function registerUser(email: string, password: string) {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email, password },
    })

    const { data } = res.json()
    const refreshCookie = res.cookies.find((cookie) => cookie.name === 'refreshToken')

    return { res, data, refreshCookie }
  }

  it('registers a user and returns tokens', async () => {
    const email = 'test@email.com'
    const password = 'my_very_strong_password'

    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email, password },
    })

    expect(res.statusCode).toBe(201)

    const { data } = res.json()

    expect(data.user).toBeDefined()
    expect(data.user.id).toBeDefined()
    expect(data.user.email).toBe(email)
    expect(data.access).toBeDefined()

    const refreshCookie = res.cookies.find((cookie) => cookie.name === 'refreshToken')

    expect(refreshCookie).toBeDefined()
    expect(refreshCookie!.value).toBeDefined()
    expect(refreshCookie!.httpOnly).toBe(true)
    expect(refreshCookie!.path).toBe('/')
    expect(refreshCookie!.sameSite).toBe('Lax')

    const savedUser = await UserModel.findOne({ email }).lean()
    expect(savedUser).not.toBeNull()
    expect(savedUser!.refreshToken).toBe(refreshCookie!.value)
  })

  it('logs in an existing user and returns new tokens', async () => {
    const email = 'login@email.com'
    const password = 'my_very_strong_password'

    const { refreshCookie: registerCookie } = await registerUser(email, password)
    expect(registerCookie).toBeDefined()

    const loginRes = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email, password },
    })

    expect(loginRes.statusCode).toBe(200)

    const { data } = loginRes.json()

    expect(data.user).toBeDefined()
    expect(data.user.email).toBe(email)
    expect(data.access).toBeDefined()

    const loginRefreshCookie = loginRes.cookies.find((cookie) => cookie.name === 'refreshToken')
    expect(loginRefreshCookie).toBeDefined()
    expect(loginRefreshCookie!.value).toBeDefined()

    expect(loginRefreshCookie!.value).not.toBe(registerCookie!.value)

    const savedUser = await UserModel.findOne({ email }).lean()
    expect(savedUser).not.toBeNull()
    expect(savedUser!.refreshToken).toBe(loginRefreshCookie!.value)
  })

  it('rejects login with invalid password', async () => {
    const email = 'wrongpass@email.com'
    const password = 'correct_password'

    await registerUser(email, password)

    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email, password: 'invalid_password' },
    })

    expect(res.statusCode).toBe(401)
  })

  it('rejects login with non-existing user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: { email: 'doesnotexist@email.com', password: 'password' },
    })

    expect(res.statusCode).toBe(401)
  })

  it('refreshes tokens using a valid refresh token cookie', async () => {
    const email = 'refresh@email.com'
    const password = 'my_very_strong_password'

    const { refreshCookie } = await registerUser(email, password)
    expect(refreshCookie).toBeDefined()

    const refreshRes = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      cookies: {
        refreshToken: refreshCookie!.value,
      },
    })

    expect(refreshRes.statusCode).toBe(200)

    const { data } = refreshRes.json()
    expect(data.access).toBeDefined()

    const newRefreshCookie = refreshRes.cookies.find((cookie) => cookie.name === 'refreshToken')
    expect(newRefreshCookie).toBeDefined()
    expect(newRefreshCookie!.value).toBeDefined()
    expect(newRefreshCookie!.value).not.toBe(refreshCookie!.value)

    const savedUser = await UserModel.findOne({ email }).lean()
    expect(savedUser).not.toBeNull()
    expect(savedUser!.refreshToken).toBe(newRefreshCookie!.value)
  })

  it('rejects refresh when refresh token cookie is missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
    })

    expect(res.statusCode).toBe(401)
  })

  it('rejects refresh with an invalid refresh token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      cookies: {
        refreshToken: 'not-a-valid-jwt',
      },
    })

    expect(res.statusCode).toBe(401)
  })

  it('logs out a user, clears cookie and stored refresh token', async () => {
    const email = 'logout@email.com'
    const password = 'my_very_strong_password'

    const { refreshCookie } = await registerUser(email, password)
    expect(refreshCookie).toBeDefined()

    const logoutRes = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      cookies: {
        refreshToken: refreshCookie!.value,
      },
    })

    expect(logoutRes.statusCode).toBe(204)

    const clearedCookie = logoutRes.cookies.find((cookie) => cookie.name === 'refreshToken')
    expect(clearedCookie).toBeDefined()
    expect(clearedCookie!.value).toBe('')

    const savedUser = await UserModel.findOne({ email }).lean()
    expect(savedUser).not.toBeNull()
    expect(savedUser!.refreshToken).toBe(null)
  })

  it('logout is idempotent when no refresh cookie is present', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/auth/logout',
    })

    expect(res.statusCode).toBe(204)
  })
})
