import { Module } from '@nestjs/common'

import { CoreDomainRepository } from 'src/mission-control/domain/tasks/repositories/core-domain-repository'
import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositoriy'

import { PostgresJsService } from './postgresjs/postgresjs.service'
import { PostgresJsCoreDomainRepository } from './postgresjs/repositories/core-domain.repositorie'
import { PrismaService } from './prisma/prisma.service'
import { PrismaTaskRepository } from './prisma/repositories/task.repositorie'

@Module({
  providers: [
    PrismaService,
    PostgresJsService,
    { provide: CoreDomainRepository, useClass: PostgresJsCoreDomainRepository },
    { provide: TaskRepository, useClass: PrismaTaskRepository },
  ],
  exports: [CoreDomainRepository, TaskRepository],
})
export class MissionControlDatabaseModule {}
