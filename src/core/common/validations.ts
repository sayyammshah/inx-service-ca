import { ValidationErrors } from './constants.js'
import { EntitySchema, validationResult } from './types.js'

// Helpers
export const isArray = (value: unknown) =>
  Object.prototype.toString.call(value) === '[object Array]'
export const isObject = (value: unknown) =>
  Object.prototype.toString.call(value) === '[object Object]'

export const validateRequiredFields = (
  toValidate: Record<string, unknown>,
  validateFrom: Array<string>,
): string => {
  let msg = ''
  for (const field of validateFrom) {
    const value = toValidate[field]
    if (!value) {
      msg = `${field} is required`
      break
    }
  }
  return msg
}

export function isValidType<T = string>(value: T, type: string): string {
  if (
    !value ||
    !type ||
    (type === 'array' && isArray(value)) ||
    (type === 'object' && isObject(value)) ||
    typeof value === type
  ) {
    return ''
  }
  return ValidationErrors.TYPE
}

export const isValidSize = (value: unknown, size: string): string => {
  if (!value || !size) return ''

  if (isArray(value)) {
    return (value as Array<unknown>).length > parseInt(size)
      ? `${ValidationErrors.LENGTH_MAX} ${size}`
      : ''
  }

  const [min, max] = size.split('-').map((val) => parseInt(val))
  if ((value as string).length < min)
    return `${ValidationErrors.LENGTH_MIN} ${min}`
  if ((value as string).length > max)
    return `${ValidationErrors.LENGTH_MAX} ${max}`
  return ''
}

export function isValidPattern(value: string, pattern: RegExp | null): string {
  if (!value || !pattern) return ''
  if (pattern.test(value) === false) return ValidationErrors.FORMAT
  return ''
}

export function isValidListValue<T>(
  value: T,
  list: Array<unknown> | Record<string, unknown> | null,
): string {
  if (
    !value ||
    !list ||
    (isArray(list) && (list as Array<T>).includes(value as T)) ||
    (isObject(list) && Object.values(list).includes(value as T))
  ) {
    return ''
  }

  return ValidationErrors.INVALID
}

export const validator = <T>(
  field: string,
  value: T,
  validations: EntitySchema['fields'][string]['validations'],
): validationResult => {
  let validationErr: string | null = ''

  const { type, size, pattern, list } = validations

  validationErr =
    isValidType<typeof value>(value, type) ||
    (size && isValidSize(value as string, size)) ||
    (pattern && isValidPattern(value as string, pattern)) ||
    (list && isValidListValue(value, list)) ||
    ''

  return {
    isValid: validationErr == '',
    validationErr: validationErr !== '' ? `'${field}' ${validationErr}` : '',
  }
}
