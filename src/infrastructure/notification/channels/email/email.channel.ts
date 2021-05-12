import { Injectable } from '@nestjs/common'

import { UserInterface } from '@core/modules/user/user.interface'
import { ChannelMetadata } from '@infrastructure/notification/types/channel-metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

import { NotificationChannel } from '../channel.interface'

type EmailMetadata = {
  template: string
} & ChannelMetadata

@Injectable()
export class EmailNotificationChannel implements NotificationChannel {
  static buildRecipientsFromUsers(users: UserInterface[]): NotificationRecipient[] {
    return users.map((user) => EmailNotificationChannel.buildSingleRecipientFromUser(user))
  }

  static buildSingleRecipientFromUser(user: UserInterface): NotificationRecipient {
    return {
      name: user.firstName,
      address: user.email,
    }
  }

  public async dispatch(data: NotificationData, metadata: EmailMetadata): Promise<void> {
    console.log('ok')
  }
}
