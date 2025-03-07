import { ResponseStatusCodes } from './constants.js'

export class ApiResponse {
  status: number = ResponseStatusCodes.OK
  data: unknown = null
  error: Record<string, unknown> | string | null = null

  constructor(
    status: number,
    data?: unknown,
    error?: Record<string, unknown> | string,
  ) {
    const retData = data
      ? Object.fromEntries(
          Object.entries(data as Record<string, unknown>).filter(
            (item) => item[0] !== 'status',
          ),
        )
      : data

    this.status = status
    this.data = retData ?? null
    this.error = error ?? null
  }
}

export class AppError {
  status: number = ResponseStatusCodes.INTERNAL_SERVER_ERROR
  cause: unknown = null
  stack?: string = ''

  constructor(
    status: number,
    cause?: Record<string, unknown> | string | null,
    stack?: string,
  ) {
    this.status = status
    this.cause = cause ?? null
    this.stack = stack ?? ''
  }

  static genErrorStr(
    status: number,
    cause: Record<string, unknown> | string | null,
    stack?: string,
  ) {
    return JSON.stringify(new AppError(status, cause, stack))
  }

  static generateGlobalErrorObject(error: AppError | Error) {
    const errorObject = {
      status: ResponseStatusCodes.INTERNAL_SERVER_ERROR,
      cause: 'Something went wrong',
      stack: '',
    }

    if (error instanceof AppError) {
      errorObject.status = error.status
      errorObject.cause = error.cause?.toString() ?? ''
      errorObject.stack = error.stack ?? ''
      return errorObject
    }

    if (error instanceof Error) {
      errorObject.cause = error.message ?? ''
      return errorObject
    }

    return error
  }
}
