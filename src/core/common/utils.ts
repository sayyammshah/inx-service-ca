import { CoreUserErrorMsg, HASH } from '@core/common/constants.js'
import { GenSecretsReturnRes } from '@core/common/types.js'
import { pbkdf2Sync, randomBytes } from 'node:crypto'

export const generateId = (): string =>
  Date.now().toString(16) + randomBytes(10).toString('hex')

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

  function verify(
    hash: string,
    payload: string,
  ): Omit<GenSecretsReturnRes, 'payload'> {
    const [salt, storedHash] = hash.split('.')

    const calculatedHash = pbkdf2Sync(
      payload,
      salt,
      HASH.ITERATIONS,
      HASH.KEY_LENGTH,
      HASH.ALGORITHM,
    ).toString('hex')

    if (calculatedHash !== storedHash)
      return { isValid: false, message: CoreUserErrorMsg.INCORRECT_PASSWORD }

    return { isValid: true, message: '' }
  }

  return { generate, verify }
}
