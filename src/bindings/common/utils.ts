import { Request } from 'express'

export function getRequestContext(req: Request) {
  const requestContext = {
    method: req.method,
    requestId: '',
    userAgent: {},
    correlationId: '',
    clientIp: '',
  }

  return requestContext
}
