import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import TeamResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [TeamResolver],
})
class TeamsModule {}

export default TeamsModule
