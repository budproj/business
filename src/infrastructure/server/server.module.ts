import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { createAppConfig } from '@config/app.factory'
import { InfrastructureModule } from '@infrastructure/infrastructure.module'
import { InterfaceModule } from '@interface/interface.module'

@Module({
  imports: [ConfigModule.forFeature(createAppConfig), InterfaceModule, InfrastructureModule],
})
export class ServerModule {}
