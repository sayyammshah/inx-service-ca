import { UserDto } from 'core/business/dto/dto.js'
import { validationResult } from '../common/types.js'
import { Rules } from '../rulesEngine/User.core.js'

export class User {
  // Immutable
  private readonly userId: string
  private readonly createdAt: number

  // Mutable
  private name: string
  private email: string
  private password: string
  private dob: number | null
  private gender: string | null
  private profilePicture: string | null
  private updatedAt: number

  constructor({
    userId,
    name,
    email,
    password,
    dob,
    gender,
    profilePicture,
  }: {
    userId: string
    name: string
    email: string
    password: string
    dob?: number | null
    gender?: string | null
    profilePicture?: string | null
  }) {
    this.userId = userId
    this.name = name
    this.email = email
    this.password = password
    this.dob = dob ?? null
    this.gender = gender ?? null
    this.profilePicture = profilePicture ?? null
    this.createdAt = this.updatedAt = new Date().getTime()
  }

  static validate(user: UserDto): validationResult {
    let message = ''

    const { getValidations } = Rules.handlers

    for (const field in user) {
      const value = user[field as keyof User]
      const validations = getValidations<typeof value>(field, value)

      message =
        validations.map((validate) => validate()).find((message) => message) ||
        ''

      if (message) {
        message = `${field}: ${message}`
        break
      }
    }

    return {
      isValid: !message,
      message: message,
    }
  }
}
