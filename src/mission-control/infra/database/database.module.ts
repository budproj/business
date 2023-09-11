import { Module } from '@nestjs/common'

import { EventSubscriber } from 'src/mission-control/domain/tasks/messaging/events'
import {
  TaskCreationConsumer,
  TaskCreationProducer,
} from 'src/mission-control/domain/tasks/messaging/task-queue'
import { CoreDomainRepository } from 'src/mission-control/domain/tasks/repositories/core-domain-repository'
import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositoriy'
import { UserRepository } from 'src/mission-control/domain/users/repositories/user-repository'

import { NodeTaskCreationConsumer } from '../messaging/consumers/task-creation.consumer'
import { NodeTaskCreationProducer } from '../messaging/producers/task-creation.producer'
import { NodeFulfillerTaskSubscriber } from '../messaging/subscribers/fulfiller-task.subscriber'

import { PostgresJsService } from './postgresjs/postgresjs.service'
import { PostgresJsCoreDomainRepository } from './postgresjs/repositories/core-domain.repositorie'
import { PrismaService } from './prisma/prisma.service'
import { PrismaTaskRepository } from './prisma/repositories/task-repositorie'
import { TypeormUserRepository } from './typeorm/repositories/user-repositorie'

@Module({
  providers: [
    PrismaService,
    PostgresJsService,
    { provide: CoreDomainRepository, useClass: PostgresJsCoreDomainRepository },
    { provide: TaskRepository, useClass: PrismaTaskRepository },
    { provide: TaskCreationProducer, useClass: NodeTaskCreationProducer },
    { provide: UserRepository, useClass: TypeormUserRepository },
    { provide: TaskCreationConsumer, useClass: NodeTaskCreationConsumer },
    { provide: EventSubscriber, useClass: NodeFulfillerTaskSubscriber },
  ],
  exports: [
    CoreDomainRepository,
    TaskRepository,
    UserRepository,
    TaskCreationProducer,
    TaskCreationConsumer,
    EventSubscriber,
  ],
})
export class MissionControlDatabaseModule {}
