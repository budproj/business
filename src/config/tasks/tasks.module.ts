import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { TasksEnvironmentSchema } from './tasks-environment.schema'
import { tasksConfig } from './tasks.config'
import { TasksConfigProvider } from './tasks.provider'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [tasksConfig],
      validationSchema: TasksEnvironmentSchema,
    }),
  ],
  providers: [ConfigService, TasksConfigProvider],
  exports: [ConfigService, TasksConfigProvider],
})
export class TasksConfigModule {}
