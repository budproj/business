import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import CycleResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [CycleResolver],
})
class CyclesModule {}

export default CyclesModule
