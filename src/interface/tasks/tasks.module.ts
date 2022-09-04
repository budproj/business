import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { TasksController } from '@interface/tasks/tasks.controller'

@Module({
  imports: [CoreModule],
  controllers: [TasksController],
  providers: [],
})
export class TasksModule {}
