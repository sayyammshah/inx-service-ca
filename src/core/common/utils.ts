import { UserDto } from '@core/business'
import { HASH, TOKEN } from '@core/common/constants.js'
import { GenSecretsReturnRes } from '@core/common/types.js'
import { createHmac, pbkdf2Sync, randomBytes, randomUUID } from 'node:crypto'

export const generateId = (): string =>
  Date.now().toString(16) + randomBytes(10).toString('hex')

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

    if (signature !== decodedSignature) response.message = 'Invalid Token'

    response.payload = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf-8'),
    )

    return response
  }

  return { generate, verify }
}

export const hashManager = () => {
  function generate(payload: string): string {
    const salt = randomBytes(HASH.SALT_LENGTH).toString('hex')
    const hash = pbkdf2Sync(
      payload,
      salt,
      HASH.ITERATIONS,
      HASH.KEY_LENGTH,
      HASH.ALGORITHM,
    ).toString('hex')

    return `${salt}.${hash}`
  }

  function verify(hash: string): Omit<GenSecretsReturnRes, 'payload'> {
    const [salt, storedHash] = hash.split('.')

    const calculatedHash = pbkdf2Sync(
      hash,
      salt,
      HASH.ITERATIONS,
      HASH.KEY_LENGTH,
      HASH.ALGORITHM,
    ).toString('hex')

    if (calculatedHash !== storedHash)
      return { isValid: false, message: 'Invalid Hash' }

    return { isValid: true, message: '' }
  }

  return { generate, verify }
}
