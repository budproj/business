import { ACTION } from 'app/authz/constants'

export enum UserPolicy {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export interface UserActionPolicies {
  [ACTION.CREATE]: UserPolicy | Promise<UserPolicy>
  [ACTION.READ]: UserPolicy | Promise<UserPolicy>
  [ACTION.UPDATE]: UserPolicy | Promise<UserPolicy>
  [ACTION.DELETE]: UserPolicy | Promise<UserPolicy>
}
