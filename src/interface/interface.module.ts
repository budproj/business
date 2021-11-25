import { Module } from '@nestjs/common'

import { TasksModule } from '@interface/tasks/tasks.module'

import { GraphQLModule } from './graphql/graphql.module'

@Module({
  imports: [GraphQLModule, TasksModule],
})
export class InterfaceModule {}
