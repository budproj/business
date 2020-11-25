import { Module } from '@nestjs/common'

import { Railway } from 'app/providers'
import DomainModule from 'domain/module'

import KeyResultViewResolver from './resolver'
import KeyResultViewService from './service'

@Module({
  imports: [DomainModule],
  providers: [KeyResultViewResolver, KeyResultViewService, Railway],
})
class KeyResultViewsModule {}

export default KeyResultViewsModule
