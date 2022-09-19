import { Controller, Logger } from '@nestjs/common'
import { MessagePattern, Payload, Transport } from '@nestjs/microservices'

@Controller()
export class TasksController {
  private readonly logger = new Logger(TasksController.name)

  @MessagePattern('dummy', Transport.NATS)
  dummy(@Payload() data: string): void {
    this.logger.log({
      data,
      message: 'New dummy message received',
    })
  }
}
