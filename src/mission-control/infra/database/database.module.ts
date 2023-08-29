import { Module } from '@nestjs/common'

import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositoriy'

import { PrismaService } from './prisma.service'
import { PrismaTaskRepository } from './prisma/repositories/task-repositorie'

@Module({
  providers: [PrismaService, { provide: TaskRepository, useClass: PrismaTaskRepository }],
  exports: [TaskRepository],
})
export class MissionControlDatabaseModule {}
