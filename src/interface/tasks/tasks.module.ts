import { Module } from '@nestjs/common'

import { TasksConfigModule } from '@config/tasks/tasks.module'
import { NatsModule } from '@infrastructure/nats/nats.module'
import { TasksProvider } from '@interface/tasks/tasks.provider'

@Module({
  imports: [TasksConfigModule, NatsModule],
  providers: [TasksProvider],
})
export class TasksModule {}
