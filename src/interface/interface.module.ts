import { Module } from '@nestjs/common'

import { TasksModule } from '@interface/tasks/tasks.module'
import { LLMsDomainModule } from 'src/llm/llms-domain.module'

import { GraphQLModule } from './graphql/graphql.module'

@Module({
  imports: [GraphQLModule, TasksModule, LLMsDomainModule],
})
export class InterfaceModule {}
