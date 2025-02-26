import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from '@bindings/express-routes'
import { MongoDBClient } from '@infra/clients'
import { httpLogger, logger } from 'shared/logger.js'

const PORT = process.env.PORT || 3001
const app = express()

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

app.use('/v1/api/user', userRouter)

// ------------------------ Routes ------------------------

// Error Middleware
app.use((err: Error, req: Request, res: Response) => {
  res.status(500).json({
    error: err.message || 'Something went wrong',
  })
})

// Start the Server
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`)
  await MongoDBClient.initiateDatabaseConnection()
})
