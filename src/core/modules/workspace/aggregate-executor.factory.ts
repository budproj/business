import { InjectConnection } from '@nestjs/typeorm'
import { Connection } from 'typeorm'

import { AggregateExecutor } from '@core/modules/workspace/aggregate-executor'

export class AggregateExecutorFactory {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  newInstance<T>(): AggregateExecutor<T> {
    return new AggregateExecutor(this.connection)
  }
}
