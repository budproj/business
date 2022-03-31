import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SentryConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get dsn(): string {
    return this.configService.get<string>('sentry.dsn')
  }

  get sampleRate(): number {
    return this.configService.get<number>('sentry.sampleRate')
  }
}
