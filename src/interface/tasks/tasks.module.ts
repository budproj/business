import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { AWSModule } from '@infrastructure/aws/aws.module'
import { NotificationModule } from '@infrastructure/notification/notification.module'
import { TasksController } from '@interface/tasks/tasks.controller'

@Module({
  imports: [CoreModule, AWSModule, NotificationModule],
  controllers: [TasksController],
  providers: [],
})
export class TasksModule {}
