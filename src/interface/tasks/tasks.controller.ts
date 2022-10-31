import { Controller, Logger } from '@nestjs/common'
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices'
import { GraphQLRequest } from 'apollo-server-core'

import { GenericActivity } from '@adapters/activity/activities/generic-activity'
import { UserInterface } from '@core/modules/user/user.interface'
import { isOfTypeCommand } from '@core/ports/commands/command.factory'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { NotificationProvider } from '@infrastructure/notification/notification.provider'

@Controller()
export class TasksController {
  private readonly logger = new Logger(TasksController.name)

  constructor(
    private readonly corePorts: CorePortsProvider,
    private readonly notification: NotificationProvider,
  ) {}

  @MessagePattern('notification-ports.*')
  async useNotification(@Payload() data: any, @Ctx() natsContext: NatsContext) {
    const messageName = natsContext.getSubject()
    const [_, commandName] = messageName.split('.')

    const user = await this.corePorts.dispatchCommand<UserInterface>('get-user', {
      id: data.userId,
    })
    const context = {
      userWithContext: user,
    }
    const activity = new GenericActivity<unknown, unknown>(
      commandName,
      data,
      context as Partial<GraphQLRequest>,
      undefined,
    )

    await this.notification.dispatch(activity)
  }

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
