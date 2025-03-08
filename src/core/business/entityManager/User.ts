import { UserAuthFields } from '@core/common/constants.js'
import { validationResult } from '@core/common/types.js'
import { entityValidator } from '@core/common/validations.js'
import { UserDto } from 'core/business/dto/entityDto.js'
import { Rules } from 'core/business/rulesEngine/User.core.js'

export class User {
  // Immutable
  readonly userId: string
  readonly createdAt: number

  // Mutable
  name: string
  email: string
  password: string
  dob: number | null
  gender: string | null
  profilePicture: string | null
  updatedAt: number

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

  static validate(user: UserDto, isAuth: boolean = false): validationResult {
    let message = ''

    for (const field in user) {
      if (isAuth && !UserAuthFields.includes(field)) continue

      const value = user[field as keyof UserDto]
      const validations = Rules.fields[field].validations
      const { isValid, message: validationMsg } = entityValidator(
        field,
        value,
        validations,
      )
      if (!isValid) {
        message = validationMsg
        break
      }
    }

    return {
      isValid: !message,
      message: message,
    }
  }
}
