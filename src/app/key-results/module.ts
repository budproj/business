import { Module } from '@nestjs/common'

import KeyResultsController from './controller'
import KeyResultsService from './service'

@Module({
  controllers: [KeyResultsController],
  providers: [KeyResultsService],
})
class KeyResultsModule {}

export default KeyResultsModule
