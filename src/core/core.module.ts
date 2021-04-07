import { Module } from '@nestjs/common'

import { CoreProvider } from './core.provider'
import { TeamModule } from './modules/team/team.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [UserModule, TeamModule],
  providers: [CoreProvider],
  exports: [CoreProvider],
})
export class CoreModule {}
