export interface AuthzConfigInterface {
  domain: string
  issuer: string
  audience: string
  credentials: AuthzCredentialsInterface
}

export interface AuthzCredentialsInterface {
  clientID: string
  clientSecret: string
}
