import { FastifyInstance } from 'fastify'
import { MongoTestContainer, withDatabase, withServer } from '../helpers'

describe('Transactions Integration', () => {
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

  async function registerAndLogin() {
    const email = 'tx@email.com'
    const password = 'very_strong_password'

    const res = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: { email, password },
    })

    expect(res.statusCode).toBe(201)

    const { data } = res.json()
    return data.access
  }

  it('rejects unauthenticated requests', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      payload: {
        pan: '4111111111111111',
        brand: 'Visa',
        amount: 100,
      },
    })

    expect(res.statusCode).toBe(401)
  })

  it('creates an approved transaction', async () => {
    const token = await registerAndLogin()

    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        pan: '4111111111111111',
        brand: 'Visa',
        amount: 100,
      },
    })

    expect(res.statusCode).toBe(201)

    const { data } = res.json()

    expect(data.status).toBe('approved')
    expect(data.authorizationCode).toBeDefined()
    expect(data.pan).toBe('************1111')
    expect(data.timestamp).toBeDefined()
  })

  it('creates a declined transaction with reason', async () => {
    const token = await registerAndLogin()

    const res = await app.inject({
      method: 'POST',
      url: '/transactions',
      headers: {
        authorization: `Bearer ${token}`,
      },
      payload: {
        pan: '4111',
        brand: 'Visa',
        amount: 100,
      },
    })

    expect(res.statusCode).toBe(201)

    const { data } = res.json()

    expect(data.status).toBe('declined')
    expect(data.reason).toBeDefined()
    expect(data.authorizationCode).toBeUndefined()
  })

  it('lists transactions with pagination', async () => {
    const token = await registerAndLogin()

    for (let i = 0; i < 3; i++) {
      await app.inject({
        method: 'POST',
        url: '/transactions',
        headers: { authorization: `Bearer ${token}` },
        payload: {
          pan: '4111111111111111',
          brand: 'Visa',
          amount: 100,
        },
      })
    }

    const res = await app.inject({
      method: 'GET',
      url: '/transactions?page=1&limit=2',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(res.statusCode).toBe(200)

    const body = res.json()

    expect(body.data).toHaveLength(2)
    expect(body.total).toBe(3)
  })

  it('filters transactions by status', async () => {
    const token = await registerAndLogin()

    await app.inject({
      method: 'POST',
      url: '/transactions',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        pan: '4111111111111111',
        brand: 'Visa',
        amount: 100,
      },
    })

    await app.inject({
      method: 'POST',
      url: '/transactions',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        pan: '4111',
        brand: 'Visa',
        amount: 100,
      },
    })

    const res = await app.inject({
      method: 'GET',
      url: '/transactions?page=1&limit=10&status=declined',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    expect(res.statusCode).toBe(200)

    const body = res.json()

    expect(body.data).toHaveLength(1)
    expect(body.data[0].status).toBe('declined')
  })
})
