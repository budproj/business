import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { NotificationModule } from '@infrastructure/notification/notification.module'
import { TasksController } from '@interface/tasks/tasks.controller'

@Module({
  imports: [CoreModule, NotificationModule],
  controllers: [TasksController],
  providers: [],
})
export class TasksModule {}
