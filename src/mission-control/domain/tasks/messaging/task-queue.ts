import { TaskScope } from '../types'

export abstract class TaskCreationProducer {
  abstract produce(scope: TaskScope): Promise<void>
}

export abstract class TaskCreationConsumer {
  abstract consume(handler: (scope: TaskScope) => void): Promise<void>
}
