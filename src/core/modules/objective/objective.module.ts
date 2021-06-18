import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TeamModule } from '@core/modules/team/team.module'

import { ObjectiveProvider } from './objective.provider'
import { ObjectiveRepository } from './objective.repository'

@Module({
  imports: [TypeOrmModule.forFeature([ObjectiveRepository]), TeamModule],
  providers: [ObjectiveProvider],
  exports: [ObjectiveProvider],
})
export class ObjectiveModule {}
