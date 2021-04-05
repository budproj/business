import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { createConfig } from '@config'

import { InterfaceModule } from './interface/interface.module'

@Module({
  imports: [ConfigModule.forFeature(createConfig), InterfaceModule],
})
export class BootstrapModule {}
