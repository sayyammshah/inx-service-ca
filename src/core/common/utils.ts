import { ThreadsDto } from '@core/business'
import {
  CoreUserErrorMsg,
  HASH,
  TIME_CONVERSIONS,
} from '@core/common/constants.js'
import { GenSecretsReturnRes, RuleSetChecks } from '@core/common/types.js'
import { pbkdf2Sync, randomBytes, randomUUID } from 'node:crypto'
import { isObject } from './validations.js'

export const generateId = (): string => randomUUID().replace(/-/g, '')

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

export const convertDate = (
  date: number,
  unit: string = 'minutes',
): number | undefined => {
  if (unit === 'minutes')
    return Math.floor((Date.now() - date) / TIME_CONVERSIONS.MINUTES)
}

export const Operations = (): {
  [key: string]: <T = number>(args: T[]) => boolean
} => ({
  greaterThan: (args) => args[0] > args[1],
  lessThan: (args) => args[0] < args[1],
  lessThanEqualsTo: (args) => args[0] <= args[1],
  equalsTo: (args) => args[0] == args[1],
  notEqualsTo: (args) => args[0] != args[1],
  isUndefined: (args) => args.every((arg) => arg === undefined || arg === null),
  isDefined: (args) => args.every((arg) => arg),
})

export const Calculate = (): {
  [key: string]: (args: number[]) => number
} => ({
  divide: (args) => args[0] / args[1],
  convertDateInMinutes: (args) =>
    Math.floor((Date.now() - args[0]) / TIME_CONVERSIONS.MINUTES),
})

export function execOperations<T>(condition: RuleSetChecks, data: T): boolean {
  const { operator, operands, calculate } = condition

  if (calculate) {
    const { field, operation } = calculate
    const indexOfField = operands.indexOf(field)
    const calcArgs = operands.map((operand) =>
      typeof operand === 'string' ? data[operand as keyof T] : operand,
    ) as number[]
    const calculatedValue = Calculate()[operation](calcArgs)
    operands[indexOfField] = calculatedValue
  }

  const args = operands.map((operand) =>
    typeof operand === 'string' ? data[operand as keyof T] : operand,
  )
  return Operations()[operator](args)
}

export const generateThreadPath = (payload: Partial<ThreadsDto>): string => {
  // rootThreadId/parentThreadId/threadId
  let threadPath = ''

  const { rootThread, parentThread, threadId } = payload

  if (rootThread) threadPath = `${rootThread}/`
  if (parentThread) threadPath += `${parentThread}/`
  threadPath += !threadPath ? `/${threadId}` : threadId

  return threadPath
}

export const isFlatStructure = (
  givenObject: Record<string, unknown>,
): boolean => {
  return Object.keys(givenObject).every(
    (key) => givenObject[key] && typeof givenObject[key] !== 'object',
  )
}
