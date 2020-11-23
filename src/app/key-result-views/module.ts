import { Logger, Module } from '@nestjs/common'

import { Railway } from 'app/providers'
import DomainModule from 'domain/module'

import KeyResultViewsController from './controller'
import KeyResultViewsService from './service'

@Module({
  imports: [DomainModule],
  controllers: [KeyResultViewsController],
  providers: [Logger, KeyResultViewsService, Railway],
})
class KeyResultViewsModule {}

export default KeyResultViewsModule
