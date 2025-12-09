import { ISODate, Id, TransactionDTO } from '@repo/schemas'
import mongoose, { Schema, type HydratedDocument, type Model } from 'mongoose'

export interface ITransaction {
  userId: mongoose.Types.ObjectId
  pan: string
  brand: 'Visa' | 'Mastercard' | 'Elo'
  amount: number
  status: 'approved' | 'declined'
  reason?: string | null
  authorizationCode?: string | null
  timestamp: Date
}

export type TransactionDocument = HydratedDocument<ITransaction>

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  pan: { type: String, required: true },
  brand: {
    type: String,
    enum: ['Visa', 'Mastercard', 'Elo'],
    required: true,
  },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['approved', 'declined'],
    required: true,
  },
  reason: { type: String, default: null },
  authorizationCode: { type: String, default: null },
  timestamp: { type: Date, required: true },
})

export const TransactionModel: Model<ITransaction> =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema)

export function toTransactionDTO(transaction: TransactionDocument): TransactionDTO {
  return {
    id: Id.parse(transaction._id.toString()),
    userId: Id.parse(transaction.userId.toString()),
    pan: transaction.pan,
    brand: transaction.brand,
    amount: transaction.amount,
    status: transaction.status,
    reason: transaction.reason ?? undefined,
    authorizationCode: transaction.authorizationCode ?? undefined,
    timestamp: ISODate.parse(transaction.timestamp.toISOString()),
  }
}
