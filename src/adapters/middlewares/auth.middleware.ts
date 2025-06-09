import { NextFunction, Request, Response } from 'express'
import { AppError } from '@shared/apiResponseCls'
import { ResponseStatusCodes } from '@shared/constants'
import { CommonErrorMsg } from '../common/constants'
import { tokenManager } from '../common/utils'

const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = String(req.headers['authorization']).split(' ')[1] ?? ''

  if (!token) {
    const appError = new AppError(
      ResponseStatusCodes.Unauthorized,
      CommonErrorMsg.UNAUTHORIZED,
      `${req.method} ${req.baseUrl}`,
    )
    res.status(appError.status).json(appError)
  }

  const { isValid, message } = tokenManager().verify(token)

  if (!isValid) {
    const appError = new AppError(
      ResponseStatusCodes.Unauthorized,
      `${message}`,
      `${req.method} ${req.baseUrl}`,
    )
    res.status(appError.status).json(appError)
  }
  next()
}

export default authenticateRequest
