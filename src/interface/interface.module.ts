import { Module } from '@nestjs/common'

import { PingController } from '@interface/ping.controller'
import { TasksModule } from '@interface/tasks/tasks.module'

import { GraphQLModule } from './graphql/graphql.module'

@Module({
  imports: [GraphQLModule, TasksModule],
  controllers: [PingController],
})
export class InterfaceModule {}
