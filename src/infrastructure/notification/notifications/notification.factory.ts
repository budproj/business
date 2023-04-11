import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { EmailNotificationChannel } from '@infrastructure/notification/channels/email/email.channel'
import { MessageBrokerNotificationChannel } from '@infrastructure/notification/channels/message-broker/message-broker.channel'
import { BaseNotification } from '@infrastructure/notification/notifications/base.notification'
import { CreatedKeyResultCommentNotification } from '@infrastructure/notification/notifications/created-key-result-comment.notification'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'

import { EmailNotificationChannelMetadata } from '../channels/email/metadata.type'
import { MessageBrokerChannelMetadata } from '../channels/message-broker/metadata.type'
import { EmailRecipient } from '../types/email-recipient.type'
import { Recipient } from '../types/recipient.type'

import { CreatedKeyResultCheckInNotification } from './created-key-result-check-in.notification'
import { CreatedKeyResultCheckMarkNotification } from './created-key-result-check-mark.notification'
import { CreatedRoutineCommentInRoutineNotification } from './created-routine-comment.notification'
import { NewKeyResultSupportTeamMemberNotification } from './new-key-result-support-team-member.notification'
import { PendingTasksNotification } from './pending-tasks.notification'

export type Channels = EmailNotificationChannel | MessageBrokerNotificationChannel
export type ChannelsMetadata = EmailNotificationChannelMetadata | MessageBrokerChannelMetadata
export type ChannelsRecipients = EmailRecipient | Recipient

// Export type NotificationChannelHashMap = ChannelHashmap<ChannelsMetadata, ChannelsRecipients>
export interface NotificationChannelHashMap {
  email: EmailNotificationChannel
  messageBroker: MessageBrokerNotificationChannel
}

@Injectable()
export class NotificationFactory {
  private readonly notificationConstructors = [
    CreatedKeyResultCommentNotification,
    CreatedKeyResultCheckInNotification,
    NewKeyResultSupportTeamMemberNotification,
    CreatedKeyResultCheckMarkNotification,
    PendingTasksNotification,
    CreatedRoutineCommentInRoutineNotification,
  ]

  private readonly channels: NotificationChannelHashMap

  constructor(
    private readonly core: CorePortsProvider,
    emailChannel: EmailNotificationChannel,
    messageBrokerChannel: MessageBrokerNotificationChannel,
  ) {
    this.channels = {
      email: emailChannel,
      messageBroker: messageBrokerChannel,
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
