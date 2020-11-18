import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { KeyResult } from './entities'
import KeyResultService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([KeyResult])],
  providers: [KeyResultService],
  exports: [KeyResultService],
})
class KeyResultModule {}

export default KeyResultModule
