import { ACTION, POLICY, RESOURCE } from 'src/app/authz/constants'
import { CONSTRAINT } from 'src/domain/constants'
import { UserDTO } from 'src/domain/user/dto'

export interface AuthzUser extends UserDTO {
  token: AuthzToken
  scopes: AuthzScopes
}

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

export type AuthzScopes = Record<RESOURCE, AuthzScopeGroup>

export type AuthzScopeGroup = Record<ACTION, CONSTRAINT>

export interface ActionPolicies {
  [ACTION.CREATE]: POLICY
  [ACTION.READ]: POLICY
  [ACTION.UPDATE]: POLICY
  [ACTION.DELETE]: POLICY
}
