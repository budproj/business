import { Injectable, Logger, OnModuleInit } from '@nestjs/common'

import { MessageData } from '@adapters/message-broker/types/message-data.type'
import { MessageException } from '@adapters/message-broker/types/message-exception.type'
import { TasksConfigProvider } from '@config/tasks/tasks.provider'
import { NatsProvider } from '@infrastructure/nats/nats.provider'

@Injectable()
export class TasksProvider implements OnModuleInit {
  private readonly logger = new Logger(TasksProvider.name)

  constructor(private readonly config: TasksConfigProvider, private readonly nats: NatsProvider) {}

  public async onModuleInit() {
    await this.nats.connect(this.config.nats.servers)
  }

  protected dummy(error: MessageException, data: MessageData): void {
    this.logger.log({
      error,
      data,
      message: 'New dummy message received',
    })
  }
}
