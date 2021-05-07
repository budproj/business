import { Permission } from '@adapters/policy/types/permission.type'

export interface AuthzToken {
  iss: string
  sub: string
  azp: string
  scope: string
  aud: string[]
  iat: number
  exp: number
  permissions?: Permission[]
}
