import { ControllerResponse } from '@bindings/common/types.js'
import { getRequestContext } from '@bindings/common/utils.js'
import { AuthenticateUser, CreateUser } from '@bindings/controllers'
import express, { NextFunction, Request, Response } from 'express'
import { ApiResponse } from 'shared/apiResponseCls.js'
import { logger } from 'shared/logger.js'

const router = express.Router()

/**
 * Handles POST requests to create a new user.
 *
 * @description
 * This route is responsible for processing incoming POST requests to create a new user.
 * It extracts the request body, calls the `CreateUser` controller function, and sends a response back to the client.
 *
 * @param req - The Express request object containing the request body.
 * @param res - The Express response object to send the response back to the client.
 * @param next - The Express next function to handle any errors that occur during processing.
 *
 * @returns {Promise<void>} - A promise that resolves when the request is processed.
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestContext = getRequestContext(req)
  logger.info({ requestContext }, `Request context generated`)
  try {
    const body = req.body
    const result: ControllerResponse = await CreateUser(body, requestContext)
    const response = new ApiResponse(result)
    logger.info(
      { response },
      `${requestContext.requestId}: Controller response - ${CreateUser.name}()`,
    )
    res.status(result.status).json(response)
  } catch (error) {
    logger.error({ error }, `${requestContext.requestId}: User creation failed`)
    next(error)
  }
})

/**
 * Handles POST requests to authenticate a user.
 *
 * This route is responsible for processing incoming POST requests to authenticate a user.
 * It extracts the request body, calls the `AuthenticateUser` controller function, and sends a response back to the client.
 *
 * @param req - The Express request object containing the request body.
 * @param res - The Express response object to send the response back to the client.
 * @param next - The Express next function to handle any errors that occur during processing.
 *
 * @returns {Promise<void>} - A promise that resolves when the request is processed.
 * The response will contain the status code and the result of the `AuthenticateUser` controller function.
 */
router.post(
  '/auth',
  async (req: Request, res: Response, next: NextFunction) => {
    const requestContext = getRequestContext(req)
    logger.info({ requestContext }, `Request context generated`)
    try {
      const body = req.body
      const result: ControllerResponse = await AuthenticateUser(
        body,
        requestContext,
      )
      const response = new ApiResponse(result)
      logger.info(
        { response },
        `${requestContext.requestId}: Controller response - ${AuthenticateUser.name}()`,
      )
      res.status(result.status).json(response)
    } catch (error) {
      logger.error({ error }, 'User authentication failed')
      next(error)
    }
  },
)

export { router as UserRouter }
