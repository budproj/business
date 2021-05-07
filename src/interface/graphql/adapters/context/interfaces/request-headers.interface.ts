import { IncomingHttpHeaders } from 'http'

export interface GraphQLRequestHeaders extends IncomingHttpHeaders {
  'session-id'?: string
}
