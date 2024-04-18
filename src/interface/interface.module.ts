import { Module } from '@nestjs/common'

import { PingController } from '@interface/ping.controller'
import { TasksModule } from '@interface/tasks/tasks.module'
import { LLMsDomainModule } from 'src/llm/llms-domain.module'

import { GraphQLModule } from './graphql/graphql.module'

@Module({
  imports: [GraphQLModule, TasksModule, LLMsDomainModule],
  controllers: [PingController],
})
export class InterfaceModule {}
