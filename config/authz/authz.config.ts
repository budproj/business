import { AuthzConfigInterface } from './authz.interface'

const { AUTHZ_ISSUER, AUTHZ_AUDIENCE } = process.env

export const authzConfig: AuthzConfigInterface = {
  issuer: AUTHZ_ISSUER,
  audience: AUTHZ_AUDIENCE,
}
