import { Module } from '@nestjs/common'

import { TasksController } from '@interface/tasks/tasks.controller'

@Module({
  imports: [],
  controllers: [TasksController],
  providers: [],
})
export class TasksModule {}
