import { AppResStatusCodes } from '@core/common/constants.ts'
import { UserDataInterface } from '@core/storage-interface'

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
    getValidations: <T>(
      key: string,
      value: T,
      isAuth: boolean,
    ) => (() => string)[]
    excValidations?: (<T>(key: string, value: T) => string)[]
  }
}

export type GenSecretsReturnRes = {
  isValid: boolean
  message: string
  payload: unknown
}

export type UserAdapters = {
  UserDataAdapter: UserDataInterface
}

// Shared
export interface CoreAppResponse {
  status: AppResStatusCodes
  uid: string
  queryResponse: unknown | null
  message: string
}
