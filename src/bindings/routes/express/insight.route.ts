import { getRequestContext } from '@bindings/common/utils.js'
import { CreateInsight } from '@bindings/controllers'
import { authenticateRequest } from '@bindings/middleware'
import { CoreAppResponse } from '@core/common/coreAppResponse.js'
import { FetchInsights } from 'bindings/controllers/insight.controller.js'
import express, { NextFunction, Request, Response } from 'express'
import { ApiResponse } from 'shared/apiResponseCls.js'
import { logger } from 'shared/logger.js'

const router = express.Router()

router.post(
  '/',
  authenticateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      const requestContext = getRequestContext(req)
      logger.info(requestContext, 'CreateInsight controller called')
      const result: CoreAppResponse = await CreateInsight(body, requestContext)
      const response = new ApiResponse(result.status, result)
      logger.info(response)
      res.status(result.status).json(response)
    } catch (error) {
      logger.error(error)
      next(error)
    }
  },
)
router.get(
  '/',
  authenticateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryParams = req.query
      const requestContext = getRequestContext(req)
      logger.info(requestContext, 'FetchInsights controller called')
      const result: CoreAppResponse = await FetchInsights(
        requestContext,
        queryParams as Record<string, string>,
      )
      const response = new ApiResponse(result.status, result)
      logger.info(response)
      res.status(result.status).json(response)
    } catch (error) {
      logger.error(error)
      next(error)
    }
  },
)

export { router as InsightRouter }
