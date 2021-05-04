import { IncomingHttpHeaders } from 'http'

export interface GraphQLRequestHeadersInterface extends IncomingHttpHeaders {
  'session-id'?: string
}
