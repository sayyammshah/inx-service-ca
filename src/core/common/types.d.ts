import { AppResponseStatus } from '@core/common/constants.ts'

export type validationResult = {
  isValid: boolean
  message: string
}

export type RulesType = {
  fields: {
    [key: string]: {
      description: string
      validations: {
        type:
          | 'string'
          | 'number'
          | 'boolean'
          | 'function'
          | 'object'
          | 'array'
          | 'enum'
        required: boolean
        format: RegExp | string | null
        minLen: number | null
        maxLen: number | null
        enumList: Record<string, unknown> | null
      }
    }
  }
  handlers: {
    getValidations: <T>(key: string, value: T) => (() => string)[]
    excValidations?: (<T>(key: string, value: T) => string)[]
  }
}

export type AppCreateUserResponse = {
  userId: string
  token: string
  queryResponse: unknown
  message: string
  status: AppResponseStatus
}

export type GenSecretsReturnRes = {
  isValid: boolean
  message: string
  payload: unknown
}
