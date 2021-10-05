import { registerAs } from '@nestjs/config'

import { AuthzConfigInterface } from './authz.interface'

export const authzConfig = registerAs(
  'authz',
  (): AuthzConfigInterface => ({
    domain: process.env.AUTHZ_DOMAIN,
    issuer: process.env.AUTHZ_ISSUER,
    audience: process.env.AUTHZ_AUDIENCE,

    credentials: {
      clientID: process.env.AUTHZ_CLIENT_ID,
      clientSecret: process.env.AUTHZ_CLIENT_SECRET,
    },
  }),
)
