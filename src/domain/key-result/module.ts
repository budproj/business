import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import KeyResultRepository from './repository'
import KeyResultService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([KeyResultRepository])],
  providers: [KeyResultService],
  exports: [KeyResultService],
})
class KeyResultModule {}

export default KeyResultModule
