import { Scope } from '@adapters/authorization/enums/scope.enum'

import { UserInterface } from '../modules/user/user.interface'

export interface CoreContext {
  constraint: Scope
  user: UserInterface
}
