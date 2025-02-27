import { TOKEN, UserErrorMsg } from '@bindings/common/constants.js'
import { GenSecretsReturnRes } from '@bindings/common/types.js'
import { UserDto } from '@core/business'
import { Request } from 'express'
import { createHmac, randomUUID } from 'node:crypto'

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
      isValid: false,
      message: '',
      payload: {},
    }

    const [signature, secret, payload] = token.split(TOKEN.DELIMETER)

    const decodedSignature = createHmac(TOKEN.ALGORITHM, secret)
      .update(payload)
      .digest('base64')

    if (signature !== decodedSignature)
      response.message = UserErrorMsg.INVALID_TOKEN

    response.payload = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8'),
    )

    return response
  }

  return { generate, verify }
}
