import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import KeyResultModule from 'app/key-result'
import UserModule from 'app/user'

import graphQLFactory from './factory'

@Module({
  imports: [NestGraphQLModule.forRootAsync(graphQLFactory), KeyResultModule, UserModule],
})
class GraphQLModule {}

export default GraphQLModule
