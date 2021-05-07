import { FastifyRequest } from 'fastify'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'

import { GraphQLRequestHeaders } from './request-headers.interface'
import { GraphQLRequestState } from './request-state.interface'

export interface GraphQLRequest extends FastifyRequest {
  headers: GraphQLRequestHeaders
  state: GraphQLRequestState
  user: AuthorizationUser
}
