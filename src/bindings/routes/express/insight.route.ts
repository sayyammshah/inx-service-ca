import { getRequestContext } from '@bindings/common/utils.js'
import {
  CreateInsight,
  FetchInsights,
  UpdateInsight,
} from '@bindings/controllers'
import { authenticateRequest } from '@bindings/middleware'
import { CoreAppResponse } from '@core/common/coreAppResponse.js'
import express, { NextFunction, Request, Response } from 'express'
import { ApiResponse } from 'shared/apiResponseCls.js'
import { logger } from 'shared/logger.js'

const router = express.Router()

router.post(
  '/',
  authenticateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const requestContext = getRequestContext(req)
    logger.info({ requestContext }, `Request context generated`)
    try {
      const body = req.body
      const result: CoreAppResponse = await CreateInsight(body, requestContext)
      const response = new ApiResponse(result.status, result)
      logger.info(
        { response },
        `${requestContext.requestId}: Controller response - ${CreateInsight.name}()`,
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
  authenticateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const requestContext = getRequestContext(req)
    logger.info({ requestContext }, `Request context generated`)
    try {
      const queryParams = req.query
      const result: CoreAppResponse = await FetchInsights(
        requestContext,
        queryParams as Record<string, string>,
      )
      const response = new ApiResponse(result.status, result)
      logger.info(
        { response },
        `${requestContext.requestId}: Controller response - ${FetchInsights.name}()`,
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
  authenticateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const requestContext = getRequestContext(req)
    logger.info({ requestContext }, `Request context generated`)
    try {
      const body = req.body
      const result: CoreAppResponse = await UpdateInsight(body, requestContext)
      const response = new ApiResponse(result.status, result)
      logger.info(
        { response },
        `${requestContext.requestId}: Controller response - ${UpdateInsight.name}()`,
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

export { router as InsightRouter }
