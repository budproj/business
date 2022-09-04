import { Controller, Logger } from '@nestjs/common'
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices'

import { isOfTypeCommand } from '@core/ports/commands/command.factory'
import { CorePortsProvider } from '@core/ports/ports.provider'

@Controller()
export class TasksController {
  private readonly logger = new Logger(TasksController.name)

  constructor(private readonly corePorts: CorePortsProvider) {}

  @MessagePattern('core-ports.*')
  async useUsersPorts(@Payload() data: string, @Ctx() context: NatsContext): Promise<unknown> {
    const messageName = context.getSubject()

    this.logger.log({
      message: `New ${messageName} message received`,
    })

    const [_, commandName] = messageName.split('.')

    if (!commandName || !isOfTypeCommand(commandName)) {
      return 'Invalid Command'
    }

    this.logger.log({
      data,
      message: `Executing the ${commandName} command`,
    })

    const dataReturned = await this.corePorts.dispatchCommand<unknown>(commandName, data)

    this.logger.log({
      data: dataReturned,
      message: `${commandName} data retunerd`,
    })

    return dataReturned
  }
}
