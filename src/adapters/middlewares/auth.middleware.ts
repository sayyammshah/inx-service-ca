import { NextFunction, Request, Response } from 'express'
import { AppError, ResponseStatusCodes } from '@shared'
import { CommonErrorMsg } from '../common/constants.js'
import { tokenManager } from '../common/utils.js'

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
