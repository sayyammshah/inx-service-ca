import { pbkdf2Sync, randomBytes, randomUUID } from 'node:crypto'
import { isObject } from './validations'
import { HASH, UserErrMsg } from './constants'
import { GenSecretsResult } from './types'

export const flatten = (
  data: Record<string, unknown>,
  prefix: string = '',
): Record<string, unknown> => {
  let result: Record<string, unknown> = {}
  for (const key in data) {
    const value = data[key]
    if (!isObject(data[key])) {
      result[prefix ? `${prefix}.${key}` : key] = value
      continue
    }
    result = { ...result, ...flatten(value as Record<string, unknown>, key) }
  }
  return result
}

export const generateId = (): string => randomUUID().replace(/-/g, '')

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
  ): Omit<GenSecretsResult, 'payload'> {
    const [salt, storedHash] = hash.split('.')

    const calculatedHash = pbkdf2Sync(
      payload,
      salt,
      HASH.ITERATIONS,
      HASH.KEY_LENGTH,
      HASH.ALGORITHM,
    ).toString('hex')

    if (calculatedHash !== storedHash)
      return { isValid: false, message: UserErrMsg.IncorrectPassword }

    return { isValid: true, message: '' }
  }

  return { generate, verify }
}
