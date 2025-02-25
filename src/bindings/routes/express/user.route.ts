import { CreateUser } from 'bindings/controllers/index.js'
import express, { NextFunction, Request, Response } from 'express'

const router = express.Router()

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body
    const response = await CreateUser(body)
    res.status(201).json(response)
  } catch (error) {
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
