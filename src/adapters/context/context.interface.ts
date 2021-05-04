import { FastifyRequest } from 'fastify'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { TracingInterface } from '@adapters/tracing/tracing.interface'

export interface ContextInterface extends FastifyRequest {
  user: AuthorizationUser
  tracing?: TracingInterface
}
