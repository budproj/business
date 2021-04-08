import { Module } from '@nestjs/common'

import { CoreProvider } from './core.provider'
import { CycleModule } from './modules/cycle/cycle.module'
import { TeamModule } from './modules/team/team.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [UserModule, TeamModule, CycleModule],
  providers: [CoreProvider],
  exports: [CoreProvider],
})
export class CoreModule {}
