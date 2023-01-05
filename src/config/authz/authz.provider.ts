import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  AuthzCredentialsInterface,
  AuthzDomainsInterface,
  AuthzScalabilityInterface,
} from './authz.interface'

@Injectable()
export class AuthzConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get issuer(): string {
    return this.configService.get<string>('authz.issuer')
  }

  get audience(): string {
    return this.configService.get<string>('authz.audience')
  }

  get connection(): string {
    return this.configService.get<string>('authz.connection')
  }

  get credentials(): AuthzCredentialsInterface {
    return this.configService.get<AuthzCredentialsInterface>('authz.credentials')
  }

  get domains(): AuthzDomainsInterface {
    return this.configService.get<AuthzDomainsInterface>('authz.domains')
  }

  get scalability(): AuthzScalabilityInterface {
    return this.configService.get<AuthzScalabilityInterface>('authz.scalability')
  }
}
