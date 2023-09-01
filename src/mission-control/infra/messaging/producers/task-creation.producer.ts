import { Injectable } from '@nestjs/common'

import { taskCreationLocalQueue } from '@core/common/messaging/queues/task-create.queue'
import { TaskCreationProducer } from 'src/mission-control/domain/tasks/messaging/task-queue'
import { TaskScope } from 'src/mission-control/domain/tasks/types'

@Injectable()
export class NodeTaskCreationProducer implements TaskCreationProducer {
  async produce(scope: TaskScope): Promise<void> {
    taskCreationLocalQueue.emit('create-task', scope)
  }
}
