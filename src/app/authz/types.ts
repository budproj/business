import { FastifyRequest } from 'fastify'

export interface AuthzToken {
  iss: string
  sub: string
  aud: string[]
  iat: number
  exp: number
  azp: string
  scope: string
  permissions: string[]
}

export interface AuthzRequest extends FastifyRequest {
  user: AuthzToken
}
