import { TracingInterface } from '@adapters/tracing/tracing.interface'

import { UserWithContext } from './user.interface'

export interface Context {
  user?: UserWithContext
  tracing?: TracingInterface
}
