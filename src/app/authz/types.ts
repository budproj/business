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

export interface AuthzUserResourceActionPolicies {
  permission: ActionPolicies
  user: ActionPolicies
  team: ActionPolicies
  cycle: ActionPolicies
  objective: ActionPolicies
  keyResult: ActionPolicies
  keyResultCheckIn: ActionPolicies
  keyResultComment: ActionPolicies
  keyResultCustomList: ActionPolicies
}

export type AuthzScopes = Record<RESOURCE, AuthzScopeGroup>

export type AuthzScopeGroup = Record<ACTION, CONSTRAINT>

export interface ActionPolicies {
  [ACTION.CREATE]: POLICY | Promise<POLICY>
  [ACTION.READ]: POLICY | Promise<POLICY>
  [ACTION.UPDATE]: POLICY | Promise<POLICY>
  [ACTION.DELETE]: POLICY | Promise<POLICY>
}
