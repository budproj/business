import { registerAs } from '@nestjs/config'

import { AuthzConfigInterface } from './authz.interface'

export const authzConfig = registerAs(
  'authz',
  (): AuthzConfigInterface => ({
    issuer: process.env.AUTHZ_ISSUER,
    audience: process.env.AUTHZ_AUDIENCE,
  }),
)
