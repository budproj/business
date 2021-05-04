import { FastifyRequest } from 'fastify'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'

export interface RequestWithUserToken extends FastifyRequest {
  user: AuthorizationUser
}
