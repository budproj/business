import { Injectable } from '@nestjs/common'

import { TaskCreationProducer } from 'src/mission-control/domain/tasks/messaging/task-queue'
import { TaskScope } from 'src/mission-control/domain/tasks/types'

import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaMessagingProducerRepository implements TaskCreationProducer {
  constructor(private readonly prisma: PrismaService) {}

  async produce(scope: TaskScope): Promise<void> {
    try {
      await this.prisma.$executeRawUnsafe(
        'SELECT * FROM pgmq_send($1, $2);',
        'assign_task_queue',
        scope,
      )
    } catch (error: unknown) {
      console.error(
        `Failed to produce message queue for ${scope.userId} in ${scope.teamId} for ${scope.weekId}:`,
        error,
      )
    }
  }
}
