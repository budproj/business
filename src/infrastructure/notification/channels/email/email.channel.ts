import { Injectable } from '@nestjs/common'

import { EmailAdapterProvider } from '@adapters/email/email.provider'
import { EmailMetadata } from '@adapters/email/types/metadata.type'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { UserInterface } from '@core/modules/user/user.interface'
import { AWSSESProvider } from '@infrastructure/aws/ses/ses.provider'
import { EmailNotificationChannelMetadata } from '@infrastructure/notification/channels/email/metadata.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

import { NotificationChannel } from '../channel.interface'

@Injectable()
export class EmailNotificationChannel
  implements NotificationChannel<EmailNotificationChannelMetadata>
{
  private readonly emailAdapter: EmailAdapterProvider

  constructor(awsSESProvider: AWSSESProvider) {
    this.emailAdapter = new EmailAdapterProvider(awsSESProvider)
  }

  static buildRecipientsFromUsers(
    users: UserInterface[],
    usersCustomTemplateData?: Array<Record<string, any>>,
  ): NotificationRecipient[] {
    const activeUsers = users.filter((user) => user.status === UserStatus.ACTIVE)

    return activeUsers.map((user, index) =>
      EmailNotificationChannel.buildSingleRecipientFromUser(user, usersCustomTemplateData?.[index]),
    )
  }

  static marshalMetadata(metadata: EmailNotificationChannelMetadata): EmailMetadata {
    return metadata
  }

  static buildSingleRecipientFromUser(
    user: UserInterface,
    customTemplateData?: Record<string, any>,
  ): NotificationRecipient {
    return {
      customTemplateData,
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
