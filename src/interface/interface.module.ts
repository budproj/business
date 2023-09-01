import { Module } from '@nestjs/common'

import { PingController } from '@interface/ping.controller'
import { TasksModule } from '@interface/tasks/tasks.module'
import { LLMsDomainModule } from 'src/llm/llms-domain.module'
import { MissionControlModule } from 'src/mission-control/mission-control.module'

import { GraphQLModule } from './graphql/graphql.module'

@Module({
  imports: [GraphQLModule, TasksModule, LLMsDomainModule, MissionControlModule],
  controllers: [PingController],
})
export class InterfaceModule {}
