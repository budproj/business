import { TracingInterface } from '@adapters/tracing/tracing.interface'

import { UserWithContext } from './user.interface'

export interface State {
  user?: UserWithContext
  tracing?: TracingInterface
}
