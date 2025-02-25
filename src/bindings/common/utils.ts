import { Request } from 'express'

export function getRequestContext(req: Request) {
  const requestContext = {
    requestId: '',
    userAgent: {},
    correlationId: '',
    clientIp: '',
  }

  return requestContext
}
