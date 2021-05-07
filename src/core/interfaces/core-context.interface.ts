import { Scope } from '@adapters/policy/enums/scope.enum'

import { UserInterface } from '../modules/user/user.interface'

export interface CoreContext {
  constraint: Scope
  user: UserInterface
}
