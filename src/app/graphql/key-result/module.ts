import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import KeyResultResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [KeyResultResolver],
})
class KeyResultsModule {}

export default KeyResultsModule
