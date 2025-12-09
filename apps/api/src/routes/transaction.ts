import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import {
  CreateTransactionRequest,
  CreateTransactionResponse,
  ErrorEnvelope,
  GetTransactionsQuery,
  GetTransactionsResponse,
} from '@repo/schemas'

import * as transactionService from '../services/transaction'

const transactions: FastifyPluginAsyncZod = async (fastify, _opts): Promise<void> => {
  fastify.post(
    '/transactions',
    {
      schema: {
        body: CreateTransactionRequest,
        response: {
          201: CreateTransactionResponse,
          '4xx': ErrorEnvelope,
          '5xx': ErrorEnvelope,
        },
      },
      preHandler: [fastify.authenticate],
    },
    async (req, reply) => {
      const userId = req.user.sub
      const { pan, brand, amount } = req.body

      const transaction = await transactionService.create({
        userId,
        pan,
        brand,
        amount,
      })

      return reply.code(201).send({
        data: transaction,
      })
    }
  )

  fastify.get(
    '/transactions',
    {
      schema: {
        querystring: GetTransactionsQuery,
        response: {
          200: GetTransactionsResponse,
          '4xx': ErrorEnvelope,
          '5xx': ErrorEnvelope,
        },
      },
      preHandler: [fastify.authenticate],
    },
    async (req, reply) => {
      const userId = req.user.sub
      const { page, limit, status } = req.query

      const result = await transactionService.list({
        userId,
        limit,
        page,
        status,
      })

      return reply.code(200).send(result)
    }
  )
}

export default transactions
