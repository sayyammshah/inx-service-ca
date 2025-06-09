import { IncomingHttpHeaders } from 'node:http'
import { RequestMethods } from '@shared/constants.ts'
import { CoreSecretsResult, ICoreResult } from '@core/shared'

export interface ControllerResponse extends ICoreResult {
  token?: string
}

export interface RequestContext {
  method: RequestMethods
  requestId: string // Unique identifier for tracking the request within this service
  userAgent: string | undefined // parseIt
  correlationId?: string // Used for tracing requests across multiple microservices
}

export type GenSecretsResult = CoreSecretsResult

export interface SessionBody extends RequestContext {
  reqData: {
    headers: IncomingHttpHeaders
    params?: Record<string, string> | null
    query?: Record<string, string> | null
    body?: Record<string, unknown> | null
  }
}
