import { type FastifyError, type FastifyReply } from 'fastify'

import { ErrorCode, HttpStatus } from '@repo/schemas'
import { ApiError, Errors } from '../utils/errors'

export const created = (res: FastifyReply, data: unknown) => {
  res.status(HttpStatus.CREATED).send(data)
}

export const ok = (res: FastifyReply, data: unknown) => {
  res.status(HttpStatus.OK).send(data)
}

export const noContent = (res: FastifyReply) => {
  res.status(HttpStatus.NO_CONTENT).send()
}

export const notFound = (res: FastifyReply) => {
  res.status(HttpStatus.NOT_FOUND).send()
}

export const badRequest = (res: FastifyReply, error: unknown) => {
  res.status(HttpStatus.BAD_REQUEST).send({ error: Errors.Validation(error) })
}

export const fastifyError = (res: FastifyReply, error: FastifyError) => {
  res
    .status(error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR)
    .send({ error: Errors.Internal(error.message) })
}

export const internalError = (res: FastifyReply) => {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({ error: Errors.Internal() })
}

const errorToStatusCode: Record<ErrorCode, HttpStatus> = {
  [ErrorCode.enum.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [ErrorCode.enum.AUTH_INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.enum.AUTH_MISSING_TOKEN]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.enum.AUTH_TOKEN_EXPIRED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.enum.AUTH_TOKEN_REUSED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.enum.AUTH_FORBIDDEN]: HttpStatus.FORBIDDEN,
  [ErrorCode.enum.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.enum.CONFLICT]: HttpStatus.CONFLICT,
  [ErrorCode.enum.RATE_LIMITED]: HttpStatus.TOO_MANY_REQUESTS,
  [ErrorCode.enum.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
}

export const apiError = (res: FastifyReply, error: ApiError) => {
  res.status(errorToStatusCode[error.code]).send({ error })
}
