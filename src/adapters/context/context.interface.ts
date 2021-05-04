import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { TracingInterface } from '@adapters/tracing/tracing.interface'

export interface ContextInterface {
  user: AuthorizationUser
  tracing?: TracingInterface
}
