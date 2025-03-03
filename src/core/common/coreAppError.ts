export class CoreAppError {
  status: number
  cause: string

  constructor(status: number, message: string) {
    this.status = status
    this.cause = message
  }
}
