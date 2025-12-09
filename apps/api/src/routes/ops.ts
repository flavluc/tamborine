import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (app, _opts): Promise<void> => {
  app.get('/healthz', function (_req, _res) {
    return 'ok'
  })

  app.get('/readyz', (_req, _res) => {
    // @TODO: check DB connectivity here
    return 'ready'
  })
}

export default root
