import { UserAuthFields } from '@core/common/constants.js'
import { validationResult } from '@core/common/types.js'
import { validator } from '@core/common/validations.js'
import { UserDto } from 'core/business/dto/entityDto.js'
import { UserSchema } from 'core/business/rulesEngine/User.core.js'
import { flatten } from '@core/common/utils.js'
import { validateRequiredFields } from '@core/common/validations.js'

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
    const toValidate = flatten(user)
    let fieldsRequired = UserSchema.requiredFields

    if (isAuth) {
      fieldsRequired = fieldsRequired.filter((field) =>
        UserAuthFields.includes(field),
      )
    }

    message = validateRequiredFields(toValidate, fieldsRequired)
    if (message) {
      return {
        isValid: false,
        validationErr: message,
      }
    }

    for (const field in toValidate) {
      if (isAuth && !UserAuthFields.includes(field)) continue

      const value = toValidate[field as keyof UserDto]
      const validations = UserSchema.fields[field].validations
      const { isValid, validationErr } = validator(field, value, validations)
      if (!isValid) {
        message = validationErr
        break
      }
    }

    return {
      isValid: !message,
      validationErr: message,
    }
  }
}
