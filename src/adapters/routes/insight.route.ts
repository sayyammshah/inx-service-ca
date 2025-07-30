import express, { NextFunction, Request, Response } from 'express'
import { logger, ApiResponse } from '@shared'
import { getRequestContext } from '../common/utils.js'
import { CoreResultInstance } from '@core'
import {
  CreateInsightController,
  FetchInsightsController,
  UpdateInsightController,
} from '../controllers/index.js'
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
      const result: CoreResultInstance = await CreateInsightController(
        body,
        requestContext,
      )
      const response = new ApiResponse(result)
      logger.info(
        { response },
        `${requestContext.requestId}: Controller response - ${CreateInsightController.name}()`,
      )
      res.status(result.status).json(response)
    } catch (error) {
      logger.error(
        { error },
        `${requestContext.requestId}: Insight creation failed`,
      )
      next(error)
    }
  },
)
router.get(
  '/',
  authRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const requestContext = getRequestContext(req)
    logger.info({ requestContext }, `Request context generated`)
    try {
      const queryParams = req.query
      const result: CoreResultInstance = await FetchInsightsController(
        requestContext,
        queryParams as Record<string, string>,
      )
      const response = new ApiResponse(result)
      logger.info(
        { response },
        `${requestContext.requestId}: Controller response - ${FetchInsightsController.name}()`,
      )
      res.status(result.status).json(response)
    } catch (error) {
      logger.error(
        { error },
        `${requestContext.requestId}: Failed to fetch insights`,
      )
      next(error)
    }
  },
)
router.patch(
  '/',
  authRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const requestContext = getRequestContext(req)
    logger.info({ requestContext }, `Request context generated`)
    try {
      const body = req.body
      const result: CoreResultInstance = await UpdateInsightController(
        body,
        requestContext,
      )
      const response = new ApiResponse(result)
      logger.info(
        { response },
        `${requestContext.requestId}: Controller response - ${UpdateInsightController.name}()`,
      )
      res.status(result.status).json(response)
    } catch (error) {
      logger.error(
        { error },
        `${requestContext.requestId}: Insight update failed`,
      )
      next(error)
    }
  },
)

export default router
