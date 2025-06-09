export interface EntityRules {
  requiredFields: Array<string>
  fields: {
    [key: string]: {
      description: string
      validations: {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'enum'
        size?: string | null // represents character length if field is of tupe string and array length if field is of type array
        list?: Array<unknown> | Record<string, unknown> | null
        childType?: string | null // applicable only if type is array or object
        pattern?: RegExp | null
        dependents?: Array<string> // applicable only in case of nested structure
      }
    }
  }
  ruleSet?: {
    [key: string]: {
      name: string
      description: string
      initialCase: string
      cases: {
        [key: string]: {
          check: RuleSetChecks
          action: RuleSetActions
          errorTxt: string
          nextCase: string | null
        }
      }
    }
  }
}

export type GenSecretsResult = {
  isValid: boolean
  message: string
  payload: unknown
}

// Adapters
export type UserAdapters = {
  UserDataAdapter: UserDataInterface
}

// Response Type Definitions
export interface IResultInst {
  status: StatusCodes
  uid: string
  qryRes: unknown | null
  msg: string
}

export interface IErrorInst {
  status: StatusCodes
  isErr: boolean
  ref: string
  msg?: string
}
