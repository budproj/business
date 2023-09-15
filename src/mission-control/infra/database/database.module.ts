import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'

import { EventSubscriber } from 'src/mission-control/domain/tasks/messaging/events'
import {
  TaskCreationConsumer,
  TaskCreationProducer,
} from 'src/mission-control/domain/tasks/messaging/task-queue'
import { CoreDomainRepository } from 'src/mission-control/domain/tasks/repositories/core-domain-repository'
import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositoriy'

import { NodeFulfillerTaskSubscriber } from '../messaging/subscribers/fulfiller-task.subscriber'

import { PostgresJsService } from './postgresjs/postgresjs.service'
import { PostgresJsCoreDomainRepository } from './postgresjs/repositories/core-domain.repositorie'
import { PrismaService } from './prisma/prisma.service'
import { PrismaMessagingConsumerRepository } from './prisma/repositories/messaging-consumer.repositorie'
import { PrismaMessagingProducerRepository } from './prisma/repositories/messaging-producer.repositorie'
import { PrismaTaskRepository } from './prisma/repositories/task.repositorie'

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [
    PrismaService,
    PostgresJsService,
    { provide: CoreDomainRepository, useClass: PostgresJsCoreDomainRepository },
    { provide: TaskRepository, useClass: PrismaTaskRepository },
    { provide: TaskCreationProducer, useClass: PrismaMessagingProducerRepository },
    { provide: TaskCreationConsumer, useClass: PrismaMessagingConsumerRepository },
    { provide: EventSubscriber, useClass: NodeFulfillerTaskSubscriber },
  ],
  exports: [
    CoreDomainRepository,
    TaskRepository,
    TaskCreationProducer,
    TaskCreationConsumer,
    EventSubscriber,
  ],
})
export class MissionControlDatabaseModule {}
