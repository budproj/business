import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CycleProvider } from './cycle.provider'
import { CycleRepository } from './cycle.repository'

@Module({
  imports: [TypeOrmModule.forFeature([CycleRepository])],
  providers: [CycleProvider],
  exports: [CycleProvider],
})
export class CycleModule {}
