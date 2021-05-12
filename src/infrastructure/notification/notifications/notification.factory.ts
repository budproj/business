import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { BaseNotification } from '@infrastructure/notification/notifications/base.notification'
import { CreatedKeyResultCommentNotification } from '@infrastructure/notification/notifications/created-key-result-comment.notification'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'

@Injectable()
export class NotificationFactory {
  private readonly notificationConstructors = [CreatedKeyResultCommentNotification]

  constructor(private readonly core: CorePortsProvider) {}

  public buildNotificationForActivity<D extends NotificationData, A extends Activity = Activity>(
    activity: A,
  ): BaseNotification<D> | undefined {
    const Notification = this.notificationConstructors.find(
      (Notification) => Notification.activityType === activity.type,
    )
    if (!Notification) return

    return new Notification(activity as any, this.core) as any
  }
}
