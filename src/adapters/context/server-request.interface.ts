import { FastifyRequest } from 'fastify'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'

export interface ServerRequest extends FastifyRequest {
  user: AuthorizationUser
}
