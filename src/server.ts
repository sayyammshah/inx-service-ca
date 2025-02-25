/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from './bindings/routes/express/index.js'
import { MongoDBClient } from 'infrastructure/clients/mongodb.js'

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

app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.baseUrl} duration - ${duration}ms`)
  })
  next()
})

// ------------------------ Routes ------------------------
app.get('/health-check', (req, res) => {
  res.json({
    'request-url': req.url,
    message: 'I am OK',
  })
})

app.use('/v1/api/user', userRouter)

// Error Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    error: err.message || 'Something went wrong',
  })
})

// Start the Server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  await MongoDBClient.initiateDatabaseConnection()
})
