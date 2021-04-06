import { Scope } from '@adapters/authorization/enums/scope.enum'
import { UserInterface } from '@core/modules/user/user.interface'

export interface CoreContext {
  constraint: Scope
  user: UserInterface
}
