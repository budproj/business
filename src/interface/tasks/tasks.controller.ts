import {
  defaultNackErrorHandler,
  RabbitPayload,
  RabbitRequest,
  RabbitRPC,
} from '@golevelup/nestjs-rabbitmq'
import { Controller, Logger } from '@nestjs/common'
import { GraphQLRequest } from 'apollo-server-core'

import { GenericActivity } from '@adapters/activity/activities/generic-activity'
import { UserInterface } from '@core/modules/user/user.interface'
import { isOfTypeCommand } from '@core/ports/commands/command.factory'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { NotificationProvider } from '@infrastructure/notification/notification.provider'
import { Stopwatch } from '@lib/logger/pino.decorator'

interface RabbitMQRequestStructure {
  fields: { routingKey: string }
}

@Controller()
export class TasksController {
  constructor(
    private readonly corePorts: CorePortsProvider,
    private readonly notification: NotificationProvider,
  ) {}

  @Stopwatch()
  @RabbitRPC({
    exchange: 'bud',
    queue: 'business.notification-ports',
    routingKey: 'business.notification-ports.#',
    errorHandler: (channel, msg, error) => {
      return defaultNackErrorHandler(channel, msg, error);
    },
    queueOptions: {
      deadLetterExchange: 'dead',
    },
  })
  async useNotification(
    @RabbitPayload() payload: any,
    @RabbitRequest() request: RabbitMQRequestStructure,
  ) {
    const { routingKey } = request.fields
    const commandName = routingKey.split('.')[2]

    const user = await this.corePorts.dispatchCommand<UserInterface>('get-user', {
      id: payload.userId,
    })
    const context = {
      userWithContext: user,
    }
    const activity = new GenericActivity<unknown, unknown>(
      commandName,
      payload,
      context as Partial<GraphQLRequest>,
      undefined,
    )

    await this.notification.dispatch(activity)
  }

  @Stopwatch()
  @RabbitRPC({
    exchange: 'bud',
    queue: 'business.core-ports',
    routingKey: 'business.core-ports.#',
    errorHandler: defaultNackErrorHandler,
    queueOptions: { deadLetterExchange: 'dead' },
  })
  async useUsersPorts(
    @RabbitPayload() payload: any,
    @RabbitRequest() request: RabbitMQRequestStructure,
  ): Promise<unknown> {
    const { routingKey } = request.fields

    const commandName = routingKey.split('.')[2]

    if (!commandName || !isOfTypeCommand(commandName)) {
      return 'Invalid Command'
    }

    const dataReturned = await this.corePorts.dispatchCommand<unknown>(commandName, payload)
    return dataReturned
  }
}
