import { Injectable, Logger, Scope } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'
import { NotificationFactory } from '@infrastructure/notification/notifications/notification.factory'

@Injectable({ scope: Scope.REQUEST })
export class NotificationProvider implements ActivityDispatcher {
  private readonly logger = new Logger(NotificationProvider.name)

  constructor(private readonly notifications: NotificationFactory) {}

  public async dispatch<D = any>(activity: Activity<D>): Promise<void> {
    const notification = this.notifications.buildNotificationForActivity(activity)
    if (!notification) return

    await notification.loadData()
    const marshalledNotification = notification.marshal()

    this.logger.log({
      notification: marshalledNotification,
      message: 'Dispatching notification',
    })

    // Await this.client.logEvent(marshalledEvent)
  }
}
