import { FastifyRequest } from 'fastify'

import { AuthzUser } from './authz/types'

export interface AppRequest extends FastifyRequest {
  user: AuthzUser
}
