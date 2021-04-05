import { ACTION, POLICY, RESOURCE, SCOPED_PERMISSION } from 'src/app/authz/constants'
import { CONSTRAINT } from 'src/domain/constants'
import { UserDTO } from 'src/domain/user/dto'

export interface AuthzUser extends UserDTO {
  token: AuthzToken
  scopes: AuthzScopes
  constraint?: AuthzUserConstraint
}

export interface AuthzToken {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
  permissions?: SCOPED_PERMISSION[]
}

export type AuthzUserConstraint = Partial<Record<RESOURCE, CONSTRAINT>>

export type AuthzScopes = Record<RESOURCE, AuthzScopeGroup>

export type AuthzScopeGroup = Record<ACTION, CONSTRAINT>

export interface ActionPolicies {
  [ACTION.CREATE]: POLICY
  [ACTION.READ]: POLICY
  [ACTION.UPDATE]: POLICY
  [ACTION.DELETE]: POLICY
}
