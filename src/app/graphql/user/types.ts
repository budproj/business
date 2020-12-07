import { ACTION } from 'app/authz/constants'

export enum UserAllowance {
  ALLOW = 'ALLOW',
  DENY = 'DENY',
}

export interface UserActionAllowances {
  [ACTION.CREATE]: UserAllowance | Promise<UserAllowance>
  [ACTION.READ]: UserAllowance | Promise<UserAllowance>
  [ACTION.UPDATE]: UserAllowance | Promise<UserAllowance>
  [ACTION.DELETE]: UserAllowance | Promise<UserAllowance>
}
