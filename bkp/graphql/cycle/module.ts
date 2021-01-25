import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLCycleResolver from './resolver'
import GraphQLCycleService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLCycleResolver, GraphQLCycleService],
})
class GraphQLCyclesModule {}

export default GraphQLCyclesModule
