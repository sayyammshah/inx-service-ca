import { ValidationErrors } from './constants.js'
import { RulesType, validationResult } from './types.js'

export function mandatoryFieldValidation<T>(
  value: T,
  required: boolean,
): string {
  if (required && !value) return ValidationErrors.REQUIRED
  return ''
}

export function typeValidation<T = string>(value: T, type: string): string {
  if (!value) return ''

  if (typeof value !== type) return ValidationErrors.TYPE
  return ''
}

export const lengthValidation = (
  value: string,
  minLen: number | null,
  maxLen: number | null,
): string => {
  if (!value) return ''

  if (minLen !== null && value.length < minLen)
    return `${ValidationErrors.LENGTH_MIN} ${minLen}`

  if (maxLen !== null && value.length > maxLen)
    return `${ValidationErrors.LENGTH_MAX} ${maxLen}`

  return ''
}

export function formatValidation(
  value: string,
  format: RegExp | string | null,
): string {
  if (!value) return ''

  if (format instanceof RegExp && format.test(value) === false)
    return ValidationErrors.FORMAT
  return ''
}

export function enumValidation<T>(
  value: T,
  enumList: Record<string, unknown> | null,
): string {
  if (!value) return ''

  if (enumList && !Object.values(enumList).includes(value as T))
    return ValidationErrors.INVALID
  return ''
}

export const entityValidator = <T>(
  field: string,
  value: T,
  validations: RulesType['fields'][string]['validations'],
): validationResult => {
  const { required, type, format, minLen, maxLen, enumList } = validations

  const message =
    (required && mandatoryFieldValidation<typeof value>(value, required)) ||
    (type && typeValidation<typeof value>(value, type)) ||
    ((minLen || maxLen) && lengthValidation(value as string, minLen, maxLen)) ||
    (format && formatValidation(value as string, format)) ||
    (enumList && enumValidation<typeof value>(value, enumList)) ||
    ''

  return {
    isValid: message == '',
    message: message !== '' ? `'${field}' ${message}` : '',
  }
}
