import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AmplitudeConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get amplitudeSecretKey(): string {
    return this.configService.get<string>('amplitude.amplitudeSecretKey')
  }

  get userProfileUrl(): string {
    return this.configService.get<string>('amplitude.userProfileUrl')
  }
}
