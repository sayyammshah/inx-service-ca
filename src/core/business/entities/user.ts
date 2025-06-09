import { ValidationResult } from '../../common/resultHandlers'
import { flatten } from '../../common/utils'
import { validator } from '../../common/validations'
import { UserEntity as UserDto } from './entity'
import { UserRules } from '../rules/user.rule'
import { validateRequiredFields } from '../../common/validations'

export default class User {
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

  static validate(user: UserDto, isAuth: boolean = false): ValidationResult {
    let message = ''
    const toValidate = flatten(user)
    let fieldsRequired = UserRules.requiredFields

    if (isAuth) {
      fieldsRequired = fieldsRequired.filter((field: string) =>
        ['email', 'password'].includes(field),
      )
    }

    message = validateRequiredFields(toValidate, fieldsRequired)
    if (message) {
      return {
        isValid: false,
        err: message,
      }
    }

    for (const field in toValidate) {
      if (isAuth && !['email', 'password'].includes(field)) continue

      const value = toValidate[field as keyof UserDto]
      const validations = UserRules.fields[field].validations
      const { isValid, err } = validator(field, value, validations)
      if (!isValid) {
        message = err
        break
      }
    }

    return {
      isValid: !message,
      err: message,
    }
  }
}
