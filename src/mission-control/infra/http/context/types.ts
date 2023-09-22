import { IncomingHttpHeaders } from 'http'

import { FastifyRequest } from 'fastify'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { TracingInterface } from '@adapters/tracing/tracing.interface'

export interface HTTPRequest extends FastifyRequest {
  headers: HTTPRequestHeaders
  user: AuthorizationUser
  userWithContext?: UserWithContext
  tracing?: TracingInterface
}

export interface HTTPRequestHeaders extends IncomingHttpHeaders {
  'session-id'?: string
}
