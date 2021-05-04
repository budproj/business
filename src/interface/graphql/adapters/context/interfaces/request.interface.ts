import { FastifyRequest } from 'fastify'

import { GraphQLRequestHeaders } from './request-headers.interface'
import { GraphQLRequestState } from './request-state.interface'

export interface GraphQLRequest extends FastifyRequest {
  headers: GraphQLRequestHeaders
  state: GraphQLRequestState
}
