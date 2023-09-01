import { Injectable } from '@nestjs/common'

import { Event } from '@core/common/messaging/base-scenarios/events'
import { taskCreationLocalQueue } from '@core/common/messaging/queues/task-create.queue'
import { EventSubscriber } from 'src/mission-control/domain/tasks/messaging/events'

@Injectable()
export class NodeFulfillerTaskSubscriber implements EventSubscriber {
  subscribe<T extends Event>(topic: string, callback: (event: T) => void): void {
    taskCreationLocalQueue.on(`event:${topic}`, callback)
  }
}
