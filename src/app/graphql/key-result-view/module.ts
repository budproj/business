import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import KeyResultViewResolver from './resolver'
import KeyResultViewService from './service'

@Module({
  imports: [DomainModule],
  providers: [KeyResultViewResolver, KeyResultViewService],
})
class KeyResultViewsModule {}

export default KeyResultViewsModule
