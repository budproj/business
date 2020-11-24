import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import TeamResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [TeamResolver],
})
class TeamsModule {}

export default TeamsModule
