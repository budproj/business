import { ACTION } from 'app/authz/constants'
import { USER_POLICY } from 'app/graphql/user/constants'

export interface UserActionPolicies {
  [ACTION.CREATE]: USER_POLICY | Promise<USER_POLICY>
  [ACTION.READ]: USER_POLICY | Promise<USER_POLICY>
  [ACTION.UPDATE]: USER_POLICY | Promise<USER_POLICY>
  [ACTION.DELETE]: USER_POLICY | Promise<USER_POLICY>
}
