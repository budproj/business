import { Module } from '@nestjs/common'

import { CoreProvider } from './core.provider'
import { CycleModule } from './modules/cycle/cycle.module'
import { KeyResultModule } from './modules/key-result/key-result.module'
import { ObjectiveModule } from './modules/objective/objective.module'
import { TeamModule } from './modules/team/team.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [UserModule, TeamModule, CycleModule, ObjectiveModule, KeyResultModule],
  providers: [CoreProvider],
  exports: [CoreProvider],
})
export class CoreModule {}
