import { Logger, Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import KeyResultViewsController from './controller'
import KeyResultViewsService from './service'

@Module({
  imports: [DomainModule],
  controllers: [KeyResultViewsController],
  providers: [Logger, KeyResultViewsService],
})
class KeyResultViewsModule {}

export default KeyResultViewsModule
