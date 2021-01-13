import { ACTION } from 'src/app/authz/constants'
import { USER_POLICY } from 'src/app/graphql/user/constants'

export interface UserActionPolicies {
  [ACTION.CREATE]: USER_POLICY | Promise<USER_POLICY>
  [ACTION.READ]: USER_POLICY | Promise<USER_POLICY>
  [ACTION.UPDATE]: USER_POLICY | Promise<USER_POLICY>
  [ACTION.DELETE]: USER_POLICY | Promise<USER_POLICY>
}
