import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import GraphQLAuthzModule from 'src/app/graphql/authz'
import { Railway } from 'src/app/providers'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLKeyResultResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule, GraphQLAuthzModule],
  providers: [GraphQLKeyResultResolver, Railway],
})
class GraphQLKeyResultsModule {}

export default GraphQLKeyResultsModule
