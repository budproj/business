import { FastifyRequest } from 'fastify'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { TracingInterface } from '@adapters/tracing/tracing.interface'

import { GraphQLRequestHeaders } from './request-headers.interface'

export interface GraphQLRequest extends FastifyRequest {
  headers: GraphQLRequestHeaders
  user: AuthorizationUser
  userWithContext?: UserWithContext
  tracing?: TracingInterface
}
