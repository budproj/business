import { Controller, Logger } from '@nestjs/common'
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices'

import { GenericActivity } from '@adapters/activity/activities/generic-activity'
import { NEW_KEY_RESULT_SUPPORT_TEAM_MEMBER_ACTIVITY_TYPE } from '@adapters/activity/activities/new-key-result-support-team-member.activity'
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

  @MessagePattern('notify')
  async teste() {
    const a = new GenericActivity<unknown, { userId: string }>(
      NEW_KEY_RESULT_SUPPORT_TEAM_MEMBER_ACTIVITY_TYPE,
      {
        id: 'a8b49219-7cc7-45f2-b435-004384689266',
        metadata: {
          userID: 'f120ec45-150d-4e24-b99d-34df20a80c64',
        },
      },
      {},
      { userId: 'f120ec45-150d-4e24-b99d-34df20a80c64' },
    )

    await this.notification.dispatch(a)
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
