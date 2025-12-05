import { FastifyPluginAsync } from 'fastify'

const root: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/healthz', function (_req, _res) {
    return 'ok'
  })

  fastify.get('/readyz', (_req, _res) => {
    // @TODO: check DB connectivity here
    return 'ready'
  })
}

export default root
