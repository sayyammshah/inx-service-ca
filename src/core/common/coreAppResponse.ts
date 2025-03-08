import { AppResStatusCodes } from './constants.js'

export class CoreAppResponse {
  status: number
  uid: string
  queryResponse: unknown | null
  message: string

  constructor() {
    this.status = AppResStatusCodes.OK
    this.uid = ''
    this.queryResponse = null
    this.message = ''
  }
}

export class CoreAppError {
  status: number
  cause: string

  constructor(status: number, message: string) {
    this.status = status
    this.cause = message
  }
}
