import type { FastifyInstance, FastifyRequest } from 'fastify'
import fp from 'fastify-plugin'

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate('authenticate', async (req: FastifyRequest) => {
    await req.jwtVerify()
  })
})
