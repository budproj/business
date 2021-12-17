import { registerAs } from '@nestjs/config'

import { AuthzConfigInterface } from './authz.interface'

export const authzConfig = registerAs(
  'authz',
  (): AuthzConfigInterface => ({
    issuer: process.env.AUTHZ_ISSUER,
    audience: process.env.AUTHZ_AUDIENCE,
    connection: process.env.AUTHZ_CONNECTION,

    credentials: {
      clientID: process.env.AUTHZ_CLIENT_ID,
      clientSecret: process.env.AUTHZ_CLIENT_SECRET,
    },

    domains: {
      default: process.env.AUTHZ_DOMAIN,
      mgmt: process.env.AUTHZ_MGMT_DOMAIN,
    },
  }),
)
