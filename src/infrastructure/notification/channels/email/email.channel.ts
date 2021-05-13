import { Injectable } from '@nestjs/common'

import { EmailAdapterProvider } from '@adapters/email/email.provider'
import { EmailMetadata } from '@adapters/email/types/metadata.type'
import { UserInterface } from '@core/modules/user/user.interface'
import { AWSSESProvider } from '@infrastructure/aws/ses/ses.provider'
import { EmailNotificationChannelMetadata } from '@infrastructure/notification/channels/email/metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

import { NotificationChannel } from '../channel.interface'

@Injectable()
export class EmailNotificationChannel
  implements NotificationChannel<EmailNotificationChannelMetadata> {
  private readonly emailAdapter: EmailAdapterProvider

  constructor(awsSESProvider: AWSSESProvider) {
    this.emailAdapter = new EmailAdapterProvider(awsSESProvider)
  }

  static buildRecipientsFromUsers(users: UserInterface[]): NotificationRecipient[] {
    return users.map((user) => EmailNotificationChannel.buildSingleRecipientFromUser(user))
  }

  static marshalMetadata(metadata: EmailNotificationChannelMetadata): EmailMetadata {
    return {
      ...metadata,
      recipients: metadata.recipients.map((recipient) => recipient.address),
    }
  }

  static buildSingleRecipientFromUser(user: UserInterface): NotificationRecipient {
    return {
      name: user.firstName,
      address: user.email,
    }
  }

  public async dispatch(
    data: NotificationData,
    metadata: EmailNotificationChannelMetadata,
  ): Promise<void> {
    const marshaledMetadata = EmailNotificationChannel.marshalMetadata(metadata)

    await this.emailAdapter.send(data, marshaledMetadata)
  }
}
