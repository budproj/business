import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import ObjectiveResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [ObjectiveResolver],
})
class ObjectivesModule {}

export default ObjectivesModule
