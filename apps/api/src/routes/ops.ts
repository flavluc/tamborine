import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (app, _opts): Promise<void> => {
  app.get('/healthz', function (_req, _res) {
    return 'ok'
  })

  app.get('/readyz', async (_req, res) => {
    try {
      await app.isDbReady()
      return 'ready'
    } catch {
      res.code(503)
      return 'not ready'
    }
  })
}

export default root
