import { Injectable, Logger, OnModuleInit } from '@nestjs/common'

import { MessageData, MessageException } from '@adapters/message-broker/message-broker.interface'
import { TasksConfigProvider } from '@config/tasks/tasks.provider'
import { NatsProvider } from '@infrastructure/nats/nats.provider'

@Injectable()
export class TasksProvider implements OnModuleInit {
  private readonly logger = new Logger(TasksProvider.name)

  constructor(private readonly config: TasksConfigProvider, private readonly nats: NatsProvider) {}

  public async onModuleInit() {
    await this.nats.connect(this.config.nats.servers)
    this.nats.subscribe('dummy', this.dummy.bind(this))
  }

  protected dummy(error: MessageException, data: MessageData): void {
    this.logger.log({
      error,
      data,
      message: 'New dummy message received',
    })
  }
}
