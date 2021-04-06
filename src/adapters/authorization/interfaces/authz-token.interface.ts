import { Permission } from '@adapters/authorization/types/permission.type'

export interface AuthzToken {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
  permissions?: Permission[]
}
