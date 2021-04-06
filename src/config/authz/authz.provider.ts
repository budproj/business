import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthzConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get issuer(): string {
    return this.configService.get<string>('authz.issuer')
  }

  get audience(): string {
    return this.configService.get<string>('authz.audience')
  }
}
