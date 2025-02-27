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
  stack: string = ''

  constructor(
    status: number,
    cause?: Record<string, unknown> | string | null,
    stack?: string,
  ) {
    this.status = status
    this.cause = cause ?? null
    this.stack = stack ?? ''
  }
}
