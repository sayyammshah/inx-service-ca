import { CoreStatusCodes } from '@core/shared'

export enum ENVS {
  DevLocal = 'dev-local',
  Test = 'test',
  Dev = 'development',
  Prod = 'production',
}

export const ResponseStatusCodes = CoreStatusCodes

export enum RequestMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
  Patch = 'PATCH',
  Options = 'OPTIONS',
}
