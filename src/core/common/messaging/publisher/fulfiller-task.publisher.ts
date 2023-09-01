import { Injectable } from '@nestjs/common'

import { EventPublisher } from '../base-scenarios/abstract'
import { Event } from '../base-scenarios/events'
import { taskCreationLocalQueue } from '../queues/task-create.queue'

@Injectable()
export class NodeFulfillerTaskPublisher implements EventPublisher {
  async publish(topic: string, event: Event) {
    taskCreationLocalQueue.emit(`event:${topic}`, event)
  }
}
