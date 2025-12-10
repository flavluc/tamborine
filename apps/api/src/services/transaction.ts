import type { TransactionDTO } from '@repo/schemas'
import mongoose from 'mongoose'
import { authorize } from '../core'
import { TransactionModel, toTransactionDTO } from '../models/Transaction'

type TransactionStatus = 'approved' | 'declined'

const authCode = () => {
  // 6 digits
  return Math.floor(100000 + Math.random() * 900000).toString()
}

interface CreateParams {
  userId: string
  pan: string
  brand: string
  amount: number
}

export async function create({
  userId,
  pan,
  brand,
  amount,
}: CreateParams): Promise<TransactionDTO> {
  const auth = authorize({ pan, brand, amount })

  const transaction = await TransactionModel.create({
    userId: new mongoose.Types.ObjectId(userId),
    //@TODO: should I mask pan at storage level?
    pan,
    brand,
    amount,
    status: auth.status,
    reason: auth.reason ?? null,
    authorizationCode: auth.status === 'approved' ? authCode() : null,
    timestamp: new Date(),
  })

  return toTransactionDTO(transaction)
}

interface ListParams {
  userId: string
  page: number
  limit: number
  status?: TransactionStatus
}

export async function list({ userId, page, limit, status }: ListParams): Promise<{
  data: TransactionDTO[]
  total: number
}> {
  const offset = (page - 1) * limit

  const filter: Record<string, unknown> = {
    userId: new mongoose.Types.ObjectId(userId),
  }

  if (status) {
    filter.status = status
  }

  const [docs, total] = await Promise.all([
    TransactionModel.find(filter).sort({ timestamp: -1 }).skip(offset).limit(limit).exec(),
    TransactionModel.countDocuments(filter),
  ])

  return {
    data: docs.map(toTransactionDTO),
    total,
  }
}
