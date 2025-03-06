import { CommonErrorMsg } from '@bindings/common/constants.js'
import { tokenManager } from '@bindings/common/utils.js'
import { NextFunction, Request, Response } from 'express'
import { AppError } from 'shared/apiResponseCls.js'
import { ResponseStatusCodes } from 'shared/constants.js'

export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = String(req.headers['authorization']).split(' ')[1] ?? ''

  if (!token) {
    const appError = new AppError(
      ResponseStatusCodes.UNAUTHORIZED,
      CommonErrorMsg.UNAUTHORIZED,
      `${req.method} ${req.baseUrl}`,
    )
    res.status(appError.status).json(appError)
  }

  const { isValid, message } = tokenManager().verify(token)

  if (!isValid) {
    const appError = new AppError(
      ResponseStatusCodes.UNAUTHORIZED,
      `${message}`,
      `${req.method} ${req.baseUrl}`,
    )
    res.status(appError.status).json(appError)
  }
  next()
}
