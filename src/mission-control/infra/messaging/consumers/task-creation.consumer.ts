import { Injectable } from '@nestjs/common'

import { taskCreationLocalQueue } from '@core/common/messaging/queues/task-create.queue'
import { TaskCreationConsumer } from 'src/mission-control/domain/tasks/messaging/task-queue'
import { TaskScope } from 'src/mission-control/domain/tasks/types'

@Injectable()
export class NodeTaskCreationConsumer implements TaskCreationConsumer {
  consume(callback: (scope: TaskScope) => void) {
    taskCreationLocalQueue.on('create-task', callback)
  }
}
