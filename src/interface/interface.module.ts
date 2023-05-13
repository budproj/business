import { Module } from '@nestjs/common'

import { TasksModule } from '@interface/tasks/tasks.module'
import { PingController } from "@interface/ping.controller";

import { GraphQLModule } from './graphql/graphql.module'

@Module({
  imports: [GraphQLModule, TasksModule],
  controllers: [PingController],
})
export class InterfaceModule {}
