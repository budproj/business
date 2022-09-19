import { Module } from '@nestjs/common'

import { AuthzModule } from '@infrastructure/authz/authz.module'

import { CoreProvider } from './core.provider'
import { CycleModule } from './modules/cycle/cycle.module'
import { KeyResultModule } from './modules/key-result/key-result.module'
import { ObjectiveModule } from './modules/objective/objective.module'
import { TaskModule } from './modules/task/task.module'
import { TeamModule } from './modules/team/team.module'
import { UserModule } from './modules/user/user.module'
import { CommandFactory } from './ports/commands/command.factory'
import { CorePortsProvider } from './ports/ports.provider'

@Module({
  imports: [
    UserModule,
    TeamModule,
    CycleModule,
    ObjectiveModule,
    KeyResultModule,
    TaskModule,
    AuthzModule,
  ],
  providers: [CoreProvider, CorePortsProvider, CommandFactory],
  exports: [CoreProvider, CorePortsProvider],
})
export class CoreModule {}
