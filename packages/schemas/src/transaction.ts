import { z } from 'zod'
import { Id, ISODate, ItemResponse, ListResponse } from './primitives'

export const TransactionStatus = z.enum(['approved', 'declined'])
export type TransactionStatus = z.infer<typeof TransactionStatus>

export const TransactionBrand = z.enum(['Visa', 'Mastercard', 'Elo'])
export type TransactionBrand = z.infer<typeof TransactionBrand>

export const TransactionDTO = z.object({
  id: Id,
  userId: Id,
  pan: z.string(),
  brand: TransactionBrand,
  amount: z.number().positive(),
  status: TransactionStatus,
  reason: z.string().optional(),
  authorizationCode: z.string().optional(),
  timestamp: ISODate,
})
export type TransactionDTO = z.infer<typeof TransactionDTO>
export const TransactionItem = ItemResponse(TransactionDTO)
export const TransactionList = ListResponse(TransactionDTO)

export const CreateTransactionRequest = z.object({
  pan: z.string().regex(/^\d+$/, 'PAN must contain only digits'),
  brand: TransactionBrand,
  amount: z.number().positive(),
})
export type CreateTransactionRequest = z.infer<typeof CreateTransactionRequest>
export const CreateTransactionResponse = ItemResponse(TransactionDTO)

export const GetTransactionsQuery = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['approved', 'declined']).optional(),
})
export type GetTransactionsQuery = z.infer<typeof GetTransactionsQuery>
export const GetTransactionsResponse = ListResponse(TransactionDTO)
