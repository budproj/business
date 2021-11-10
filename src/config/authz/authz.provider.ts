import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AuthzCredentialsInterface } from './authz.interface'

@Injectable()
export class AuthzConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get domain(): string {
    return this.configService.get<string>('authz.domain')
  }

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
}
