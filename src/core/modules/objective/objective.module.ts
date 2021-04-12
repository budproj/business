import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CycleModule } from '@core/modules/cycle/cycle.module'
import { TeamModule } from '@core/modules/team/team.module'

import { ObjectiveProvider } from './objective.provider'
import { ObjectiveRepository } from './objective.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ObjectiveRepository]), TeamModule, CycleModule],
  providers: [ObjectiveProvider],
  exports: [ObjectiveProvider],
})
export class ObjectiveModule {}
