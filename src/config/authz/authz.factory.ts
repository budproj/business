import { authzConfig } from './authz.config'
import { AuthzConfigInterface } from './authz.interface'

export function createAuthzConfig(): AuthzConfigInterface {
  return authzConfig
}
