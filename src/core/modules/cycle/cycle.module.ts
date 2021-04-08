import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TeamModule } from '@core/modules/team/team.module'

import { CycleProvider } from './cycle.provider'
import { CycleRepository } from './cycle.repository'

@Module({
  imports: [TypeOrmModule.forFeature([CycleRepository]), TeamModule],
  providers: [CycleProvider],
  exports: [CycleProvider],
})
export class CycleModule {}
