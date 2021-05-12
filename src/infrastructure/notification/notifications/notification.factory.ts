import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { NotificationChannel } from '@infrastructure/notification/channels/channel.interface'
import { EmailNotificationChannel } from '@infrastructure/notification/channels/email/email.channel'
import { BaseNotification } from '@infrastructure/notification/notifications/base.notification'
import { CreatedKeyResultCommentNotification } from '@infrastructure/notification/notifications/created-key-result-comment.notification'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'

@Injectable()
export class NotificationFactory {
  private readonly notificationConstructors = [CreatedKeyResultCommentNotification]
  private readonly channels: Record<string, NotificationChannel>

  constructor(private readonly core: CorePortsProvider, emailChannel: EmailNotificationChannel) {
    this.channels = {
      email: emailChannel,
    }
  }

  public buildNotificationForActivity<D extends NotificationData, A extends Activity = Activity>(
    activity: A,
  ): BaseNotification<D> | undefined {
    const Notification = this.notificationConstructors.find(
      (Notification) => Notification.activityType === activity.type,
    )
    if (!Notification) return

    return new Notification(activity as any, this.channels, this.core) as any
  }
}
