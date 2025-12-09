import { FastifyInstance } from 'fastify'

import { MongoTestContainer, withDatabase, withServer } from '../helpers'

describe('OPS endpoints tests', () => {
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

  test('GET /healthz should return ok', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/healthz',
    })

    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('ok')
  })

  test('GET /readyz should return ready when resources are ready', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/readyz',
    })

    expect(response.statusCode).toBe(200)
    expect(response.payload).toBe('ready')
  })
})
