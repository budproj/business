import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { TracingInterface } from '@adapters/tracing/tracing.interface'

export interface Context {
  user?: AuthorizationUser
  tracing?: TracingInterface
}
