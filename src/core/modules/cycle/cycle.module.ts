import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ObjectiveModule } from '@core/modules/objective/objective.module'
import { TeamModule } from '@core/modules/team/team.module'

import { CycleProvider } from './cycle.provider'
import { CycleRepository } from './cycle.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([CycleRepository]),
    TeamModule,
    forwardRef(() => ObjectiveModule),
  ],
  providers: [CycleProvider],
  exports: [CycleProvider],
})
export class CycleModule {}
