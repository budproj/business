import { Module } from '@nestjs/common'

import { CoreDomainRepository } from 'src/mission-control/domain/tasks/repositories/core-domain-repository'
import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositoriy'
import { FulfillCheckinTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fulfil-checkin-task'
import { FulfillCommenBarrierKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-barrier-key-result-task'
import { FulfillCommentOnKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-key-result-task'
import { FulfillCommentOnLowConfidenceKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-low-confidence-key-result-task'
import { FulfillEmptyDescriptionTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-empty-description-task'

import { PostgresJsService } from './postgresjs/postgresjs.service'
import { PostgresJsCoreDomainRepository } from './postgresjs/repositories/core-domain.repositorie'
import { PrismaService } from './prisma/prisma.service'
import { PrismaTaskRepository } from './prisma/repositories/task.repositorie'

@Module({
  providers: [
    PrismaService,
    PostgresJsService,
    FulfillCheckinTask,
    FulfillEmptyDescriptionTask,
    FulfillCommentOnKeyResultTask,
    FulfillCommenBarrierKeyResultTask,
    FulfillCommentOnLowConfidenceKeyResultTask,
    { provide: CoreDomainRepository, useClass: PostgresJsCoreDomainRepository },
    { provide: TaskRepository, useClass: PrismaTaskRepository },
  ],
  exports: [CoreDomainRepository, TaskRepository],
})
export class MissionControlDatabaseModule {}
