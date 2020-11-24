import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import ConfidenceReportModule from './confidence-report'
import graphQLFactory from './factory'
import KeyResultModule from './key-result'
import ObjectiveModule from './objective'
import ProgressReportModule from './progress-report'
import TeamModule from './team'
import UserModule from './user'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync(graphQLFactory),
    KeyResultModule,
    UserModule,
    ObjectiveModule,
    TeamModule,
    ProgressReportModule,
    ConfidenceReportModule,
  ],
})
class GraphQLModule {}

export default GraphQLModule
