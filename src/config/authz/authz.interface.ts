export interface AuthzConfigInterface {
  domain: string
  issuer: string
  audience: string
  connection: string
  credentials: AuthzCredentialsInterface
}

export interface AuthzCredentialsInterface {
  clientID: string
  clientSecret: string
}
