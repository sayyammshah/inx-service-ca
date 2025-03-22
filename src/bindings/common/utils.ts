import { TOKEN, UserErrorMsg } from '@bindings/common/constants.js'
import { GenSecretsReturnRes, RequestContext } from '@bindings/common/types.js'
import { UserDto } from '@core/business'
import { Request } from 'express'
import { createHmac, randomUUID } from 'node:crypto'
import { IncomingHttpHeaders } from 'node:http'
import { fileURLToPath } from 'node:url'
import { RequestMethods } from 'shared/constants.js'
import { generateUUID } from 'shared/utils.js'

export function getRequestContext(req: Request): RequestContext {
  const headers: IncomingHttpHeaders = req.headers

  const requestContext: RequestContext = {
    method: req.method as RequestMethods,
    requestId: (headers['request-id'] ?? generateUUID()) as string,
    userAgent: headers['user-agent'],
    correlationId: headers['x-Correlation-id'] as string, // optional
  }

  return requestContext
}

export const tokenManager = () => {
  function generate(payloadToEncode: Partial<UserDto> & { userId: string }) {
    const tokenPayload = Buffer.from(JSON.stringify(payloadToEncode)).toString(
      'base64',
    )

    const tokenSecret = randomUUID().replace(/-/g, '')

    const tokenSignature = createHmac(TOKEN.ALGORITHM, tokenSecret)
      .update(tokenPayload)
      .digest('base64')

    return `${tokenSignature}.${tokenSecret}.${tokenPayload}`
  }

  function verify(token: string): GenSecretsReturnRes {
    const response = {
      isValid: true,
      message: '',
      payload: {},
    }

    const [signature, secret, payload] = token.split(TOKEN.DELIMETER)

    const decodedSignature = createHmac(TOKEN.ALGORITHM, secret)
      .update(payload)
      .digest('base64')

    if (signature !== decodedSignature) {
      response.message = UserErrorMsg.INVALID_TOKEN
      response.isValid = false
      return response
    }

    response.payload = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8'),
    )

    return response
  }

  return { generate, verify }
}

export const genStack = (path: string): string =>
  `/src${fileURLToPath(path).split('/src')[1]}`
