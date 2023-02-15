import { Injectable, Logger, Scope } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'
import { NotificationFactory } from '@infrastructure/notification/notifications/notification.factory'

@Injectable()
export class NotificationProvider implements ActivityDispatcher {
  private readonly logger = new Logger(NotificationProvider.name)

  constructor(private readonly notifications: NotificationFactory) {}

  public async dispatch<D = any>(activity: Activity<D>): Promise<void> {
    const notification = this.notifications.buildNotificationForActivity(activity)
    if (!notification) return

    await notification.prepare()
    this.logger.log({
      ...notification.marshal(),
      message: 'Dispatching notification',
    })

    await notification.dispatch()
  }
}
