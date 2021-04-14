import { Module } from '@nestjs/common'

import { ServerConfigModule } from '@config/server/server.module'
import { InfrastructureModule } from '@infrastructure/infrastructure.module'
import { InterfaceModule } from '@interface/interface.module'

@Module({
  imports: [ServerConfigModule, InterfaceModule, InfrastructureModule],
})
export class ServerModule {}
