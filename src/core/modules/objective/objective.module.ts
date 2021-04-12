import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CycleModule } from '@core/modules/cycle/cycle.module'
import { KeyResultModule } from '@core/modules/key-result/key-result.module'
import { TeamModule } from '@core/modules/team/team.module'

import { ObjectiveProvider } from './objective.provider'
import { ObjectiveRepository } from './objective.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([ObjectiveRepository]),
    TeamModule,
    forwardRef(() => CycleModule),
    forwardRef(() => KeyResultModule),
  ],
  providers: [ObjectiveProvider],
  exports: [ObjectiveProvider],
})
export class ObjectiveModule {}
