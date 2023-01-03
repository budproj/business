import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AmplitudeConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get devSecretKey(): string {
    return this.configService.get<string>('amplitude.devSecretKey')
  }

  get prodSecretKey(): string {
    return this.configService.get<string>('amplitude.prodSecretKey')
  }

  get userProfileUrl(): string {
    return this.configService.get<string>('amplitude.userProfileUrl')
  }

  get nodeEnv(): string {
    return this.configService.get<string>('amplitude.nodeEnv')
  }
}
