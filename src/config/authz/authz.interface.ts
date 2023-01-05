export interface AuthzConfigInterface {
  issuer: string
  audience: string
  connection: string
  credentials: AuthzCredentialsInterface
  domains: AuthzDomainsInterface
  scalability: AuthzScalabilityInterface
}

export interface AuthzCredentialsInterface {
  clientID: string
  clientSecret: string
}

export interface AuthzDomainsInterface {
  default: string
  mgmt: string
}

export interface AuthzScalabilityInterface {
  tokenProvider: {
    enableCache: boolean
    cacheTTLInSeconds: number
  }
  retry: {
    enabled: boolean
    maxRetries: number
  }
}
