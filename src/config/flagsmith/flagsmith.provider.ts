import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class FlagsmithConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get environmentKey(): string {
    return this.configService.get<string>('flagsmith.environmentKey')
  }
}
