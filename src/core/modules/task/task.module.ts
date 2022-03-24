import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TaskProvider } from './task.provider'
import { TaskRepository } from './task.repository'

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  providers: [TaskProvider],
  exports: [TaskProvider],
})
export class TaskModule {}
