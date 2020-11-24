import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import CycleRepository from './repository'
import CycleService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([CycleRepository])],
  providers: [CycleService],
  exports: [CycleService],
})
class CycleModule {}

export default CycleModule
