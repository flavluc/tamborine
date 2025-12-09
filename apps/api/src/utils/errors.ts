import { ErrorCode } from '@repo/schemas'

export class ApiError extends Error {
  readonly code: ErrorCode
  readonly details?: unknown

  constructor(code: ErrorCode, message: string, details?: unknown) {
    super(message)
    this.code = code
    this.details = details
  }
}

export const Errors = {
  Validation(details?: unknown) {
    return new ApiError(ErrorCode.enum.VALIDATION_ERROR, 'Invalid request', details)
  },

  Auth: {
    InvalidCredentials() {
      return new ApiError(ErrorCode.enum.AUTH_INVALID_CREDENTIALS, 'Invalid email or password')
    },
    MissingToken() {
      return new ApiError(ErrorCode.enum.AUTH_MISSING_TOKEN, 'Authorization token is missing')
    },
    TokenExpired() {
      return new ApiError(ErrorCode.enum.AUTH_TOKEN_EXPIRED, 'Authentication token has expired')
    },
    TokenReused() {
      return new ApiError(
        ErrorCode.enum.AUTH_TOKEN_REUSED,
        'Authentication token has already been used'
      )
    },
    Forbidden() {
      return new ApiError(
        ErrorCode.enum.AUTH_FORBIDDEN,
        'You are not allowed to perform this action'
      )
    },
  },

  NotFound(resource: string, details?: unknown) {
    return new ApiError(ErrorCode.enum.NOT_FOUND, `${resource} not found`, details)
  },

  Conflict(message: string, details?: unknown) {
    return new ApiError(ErrorCode.enum.CONFLICT, message, details)
  },

  RateLimited() {
    return new ApiError(ErrorCode.enum.RATE_LIMITED, 'Too many requests')
  },

  Internal(details?: unknown) {
    return new ApiError(ErrorCode.enum.INTERNAL, 'Unexpected server error', details)
  },
}
