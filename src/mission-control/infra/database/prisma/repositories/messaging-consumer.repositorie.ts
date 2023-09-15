import { Injectable } from '@nestjs/common'

import { TaskCreationConsumer } from 'src/mission-control/domain/tasks/messaging/task-queue'
import { TaskScope } from 'src/mission-control/domain/tasks/types'

import { PrismaService } from '../prisma.service'

type QueryOutput = {
  message: TaskScope
}

@Injectable()
export class PrismaMessagingConsumerRepository implements TaskCreationConsumer {
  constructor(private readonly prisma: PrismaService) {}
  async consume(callback: (scope: TaskScope) => void) {
    const [result] = await this.prisma.$queryRaw<QueryOutput[]>` 
      SELECT * FROM pgmq_pop('assign_task_queue');
    `
    if (result) callback(result.message)
  }
}
