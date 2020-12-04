import { RESOURCE, SCOPE } from 'app/authz/constants'
import { UserDTO } from 'domain/user/dto'

export interface AuthzToken {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
  permissions: string[]
}

export interface AuthzUser extends UserDTO {
  token: AuthzToken
  scopes: AuthzScopes
}

export type AuthzScopes = Record<RESOURCE, SCOPE>
