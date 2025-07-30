import express, { NextFunction, Request, Response } from 'express'
import { logger, ApiResponse } from '@shared'
import { CoreResultInstance } from '@core'
import { getRequestContext } from '../common/utils.js'
import { CreateThreadController } from '../controllers/thread.controller.js'
import { authRequest } from '../middlewares/index.js'

const router = express.Router()

router.post(
  '/',
  authRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const requestContext = getRequestContext(req)
    logger.info({ requestContext }, `Request context generated`)
    try {
      const body = req.body
      const result: CoreResultInstance = await CreateThreadController(
        body,
        requestContext,
      )
      const response = new ApiResponse(result)
      logger.info(
        { response },
        `${requestContext.requestId}: Controller response - ${CreateThreadController.name}()`,
      )
      res.status(result.status).json(response)
    } catch (error) {
      logger.error(
        { error },
        `${requestContext.requestId}: Failed to create thread`,
      )
      next(error)
    }
  },
)

export default router
