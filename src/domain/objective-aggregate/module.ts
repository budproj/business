import { Module } from '@nestjs/common'

import KeyResultModule from './key-result'
import ObjectiveAggregateService from './service'

@Module({
  imports: [KeyResultModule],
  providers: [ObjectiveAggregateService],
  exports: [ObjectiveAggregateService],
})
class ObjectiveAggregateModule {}

export default ObjectiveAggregateModule
