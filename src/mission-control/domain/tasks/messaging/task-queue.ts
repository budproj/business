import { MessageException } from '@adapters/message-broker/types'

import { TaskScope } from '../types'

export abstract class TaskCreationProducer {
  abstract produce(scope: TaskScope): Promise<void>
}

export abstract class TaskCreationConsumer {
  abstract consume(
    queue: string,
    callback: (excepion: MessageException, scope: TaskScope) => void,
  ): void
}
