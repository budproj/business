import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import {
  TypeORMAuthenticationConfigInterface,
  TypeORMConventionsConfigInterface,
  TypeORMEndpointConfigInterface,
  TypeORMLoggingConfigInterface,
  TypeORMPatternConfigInterface,
  TypeORMExtraConfigInterface,
} from './typeorm.interface'

@Injectable()
export class TypeORMConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get type(): string {
    return this.configService.get<string>('typeorm.type')
  }

  get endpoint(): TypeORMEndpointConfigInterface {
    return this.configService.get<TypeORMEndpointConfigInterface>('typeorm.endpoint')
  }

  get authentication(): TypeORMAuthenticationConfigInterface {
    return this.configService.get<TypeORMAuthenticationConfigInterface>('typeorm.authentication')
  }

  get pattern(): TypeORMPatternConfigInterface {
    return this.configService.get<TypeORMPatternConfigInterface>('typeorm.pattern')
  }

  get logging(): TypeORMLoggingConfigInterface {
    return this.configService.get<TypeORMLoggingConfigInterface>('typeorm.logging')
  }

  get conventions(): TypeORMConventionsConfigInterface {
    return this.configService.get<TypeORMConventionsConfigInterface>('typeorm.conventions')
  }

  get extra(): TypeORMExtraConfigInterface {
    return this.configService.get<TypeORMExtraConfigInterface>('typeorm.extra')
  }
}
