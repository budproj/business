import { FastifyRequest } from 'fastify'

import { ContextInterface } from '@adapters/context/context.interface'

import { GraphQLRequestHeadersInterface } from './request-headers.interface'

export interface ContextGraphQLRequestInterface extends FastifyRequest, ContextInterface {
  headers: GraphQLRequestHeadersInterface
}
