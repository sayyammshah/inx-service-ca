import { CoreAppResponse } from '@core/common/coreAppResponse.ts'
import { IncomingHttpHeaders } from 'node:http'
import { RequestMethods } from 'shared/constants.ts'

export interface ControllerResponse extends CoreAppResponse {
  token?: string
}

export type GenSecretsReturnRes = {
  isValid: boolean
  message: string
  payload: unknown
}

export interface RequestContext {
  method: RequestMethods
  requestId: string // Unique identifier for tracking the request within this service
  userAgent: string | undefined // parseIt
  correlationId: string // Used for tracing requests across multiple microservices
}

export interface SessionBody extends RequestContext {
  reqData: {
    headers: IncomingHttpHeaders
    params?: Record<string, string> | null
    query?: Record<string, string> | null
    body?: Record<string, unknown> | null
  }
}
