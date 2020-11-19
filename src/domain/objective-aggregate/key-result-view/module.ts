import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import KeyResultViewRepository from './repository'
import KeyResultViewService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([KeyResultViewRepository])],
  providers: [KeyResultViewService],
  exports: [KeyResultViewService],
})
class KeyResultViewModule {}

export default KeyResultViewModule
