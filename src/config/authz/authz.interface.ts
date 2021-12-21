export interface AuthzConfigInterface {
  issuer: string
  audience: string
  connection: string
  credentials: AuthzCredentialsInterface
  domains: AuthzDomainsInterface
}

export interface AuthzCredentialsInterface {
  clientID: string
  clientSecret: string
}

export interface AuthzDomainsInterface {
  default: string
  mgmt: string
}
