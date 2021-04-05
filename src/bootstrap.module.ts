import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { createAppConfig } from '@config/app.factory'

import { InterfaceModule } from './interface/interface.module'

@Module({
  imports: [ConfigModule.forFeature(createAppConfig), InterfaceModule],
})
export class BootstrapModule {}
