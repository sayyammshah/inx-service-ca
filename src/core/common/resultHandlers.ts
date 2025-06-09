import { StatusCodes } from './constants'
import { IResultInst, IErrorInst } from './types'

export class ErrorInst implements IErrorInst {
  status: StatusCodes
  isErr: boolean
  ref: string
  msg: string

  constructor(
    ref: string,
    msg: string = '',
    status: StatusCodes = StatusCodes.BadRequest,
  ) {
    this.isErr = true
    this.ref = ref
    this.msg = msg
    this.status = status
  }
}

export class ValidationResult {
  public isValid: boolean = false
  public err: string = ''

  constructor(isValid: boolean, err: string) {
    this.isValid = isValid
    this.err = err
  }
}

export class ResultInst implements IResultInst {
  status: StatusCodes
  uid: string
  qryRes: unknown
  msg: string

  constructor() {
    this.status = StatusCodes.Ok
    this.uid = ''
    this.qryRes = null
    this.msg = ''
  }
}
