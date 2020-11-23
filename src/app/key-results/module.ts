import { Logger, Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import KeyResultsController from './controller'
import KeyResultsService from './service'

@Module({
  imports: [DomainModule],
  controllers: [KeyResultsController],
  providers: [KeyResultsService, Logger],
})
class KeyResultsModule {}

export default KeyResultsModule
