import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import ObjectiveRepository from './repository'
import ObjectiveService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([ObjectiveRepository])],
  providers: [ObjectiveService],
  exports: [ObjectiveService],
})
class ObjectiveModule {}

export default ObjectiveModule
