import { ControllerResponse } from '@bindings/common/types.js'
import { CreateUser } from '@bindings/controllers'
import express, { NextFunction, Request, Response } from 'express'
import { ApiResponse } from 'shared/apiResponseCls.js'
import { logger } from 'shared/logger.js'

const router = express.Router()

/**
 * Handles POST requests to create a new user.
 *
 * @remarks
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
  try {
    const body = req.body
    const result: ControllerResponse = await CreateUser(body)
    const response = new ApiResponse(result.status, result)
    logger.info(response)
    res.status(result.status).json(response)
  } catch (error) {
    logger.error(error)
    next(error)
  }
})

router.get('/', (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      messsage: 'User Get Endpoint',
    })
  } catch (error) {
    next(error)
  }
})

export default router
