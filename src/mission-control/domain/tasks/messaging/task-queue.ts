import { TaskScope } from '../types'

export abstract class TaskCreationProducer {
  abstract produce(scope: TaskScope): Promise<void>
}

export abstract class TaskCreationConsumer {
  abstract consume(callback: (scope: TaskScope) => void): void
}
