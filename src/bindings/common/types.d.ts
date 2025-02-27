import { CoreAppResponse } from '@core/common/types.js'

export interface ControllerResponse extends CoreAppResponse {
  token: string
}

export type GenSecretsReturnRes = {
  isValid: boolean
  message: string
  payload: unknown
}
