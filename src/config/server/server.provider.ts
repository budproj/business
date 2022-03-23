import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { ServerLoggingConfigInterface } from './server.interface'

@Injectable()
export class ServerConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('server.port')
  }

  get host(): string {
    return this.configService.get<string>('server.host')
  }

  get networkAddress(): string {
    return this.configService.get<string>('server.networkAddress')
  }

  get isCodespaces(): boolean {
    return this.configService.get<boolean>('server.isCodespaces')
  }

  get prefix(): string | undefined {
    return this.configService.get<string | undefined>('server.prefix')
  }

  get logging(): ServerLoggingConfigInterface {
    return this.configService.get<ServerLoggingConfigInterface>('server.logging')
  }
}
