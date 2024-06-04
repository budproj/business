import { Injectable, Logger } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'
import { NotificationFactory } from '@infrastructure/notification/notifications/notification.factory'
import { Stopwatch } from '@lib/logger/pino.decorator'

@Injectable()
export class NotificationProvider implements ActivityDispatcher {
  constructor(private readonly notifications: NotificationFactory) {}

  @Stopwatch()
  public async dispatch<D = any>(activity: Activity<D>): Promise<void> {
    const notification = this.notifications.buildNotificationForActivity(activity)
    if (!notification) return

    await notification.prepare()

    await notification.dispatch()
  }
}
