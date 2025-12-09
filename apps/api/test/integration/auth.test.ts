import { FastifyInstance } from 'fastify'
import { MongoTestContainer, withDatabase, withServer } from '../helpers'

import { UserModel } from '../../src/models/User'

describe('Authentication Integration Tests', () => {
  let app: FastifyInstance
  let container: MongoTestContainer

  beforeAll(async () => {
    container = await withDatabase()
    app = await withServer(container.uri)
  }, 20_000)

  afterAll(async () => {
    await app.close()
    await container.close()
  })

  afterEach(async () => {
    await container.clear()
  })

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
})
