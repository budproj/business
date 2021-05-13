import { Injectable } from '@nestjs/common'

import { EmailAdapterProvider } from '@adapters/email/email.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { AWSSESProvider } from '@infrastructure/aws/ses/ses.provider'
import { ChannelMetadata } from '@infrastructure/notification/types/channel-metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

import { NotificationChannel } from '../channel.interface'

type EmailMetadata = {
  template: string
} & ChannelMetadata

@Injectable()
export class EmailNotificationChannel implements NotificationChannel {
  private readonly emailAdapter: EmailAdapterProvider

  constructor(awsSESProvider: AWSSESProvider) {
    this.emailAdapter = new EmailAdapterProvider(awsSESProvider)
  }

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
    await this.emailAdapter.send()
  }
}
