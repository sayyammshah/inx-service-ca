import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import {
  UserRouter,
  InsightRouter,
  ThreadRouter,
} from '@bindings/express-routes'
import { MongoDBClient } from '@infra/clients'
import { httpLogger, logger } from 'shared/logger.js'
import { ApiResponse, AppError } from 'shared/apiResponseCls.js'

const PORT = process.env.PORT || 3001
const app = express()

// Middlewares

app.use(
  express.json({
    limit: '50mb',
  }),
)

app.use(
  cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    maxAge: 3600, // CORS preflight response cached for 1 hour
    // exposedHeaders: ['X-Custom-Header-1', 'X-Custom-Header-2'],
  }),
)

app.use(httpLogger)

// ------------------------ Routes ------------------------

app.get('/health-check', (req, res) => {
  logger.info('Health check called')
  res.json({
    'request-url': req.url,
    message: 'I am OK',
  })
})

app.use('/v1/api/user', UserRouter)
app.use('/v1/api/inx', InsightRouter)
app.use('/v1/api/thread', ThreadRouter)

// ------------------------ Routes ------------------------

// Error Middleware
app.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    const errObject = AppError.generateGlobalErrorObject(err)
    res.status(errObject.status).json(
      new ApiResponse(errObject.status, null, {
        cause: errObject.cause,
        stack: errObject.stack ?? '',
      }),
    )
  },
)

// Start the Server
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`)
  await MongoDBClient.initiateDatabaseConnection()
})
