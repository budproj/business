import { Injectable } from '@nestjs/common'
import { uniq } from 'lodash'

import { EmailAdapterProvider } from '@adapters/email/email.provider'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { UserInterface } from '@core/modules/user/user.interface'
import { AWSSESProvider } from '@infrastructure/aws/ses/ses.provider'
import { NotificationChannel } from '@infrastructure/notification/channels/channel.interface'
import { EmailNotificationChannelMetadata } from '@infrastructure/notification/channels/email/metadata.type'
import { EmailRecipient } from '@infrastructure/notification/types/email-recipient.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'

@Injectable()
export class EmailNotificationChannel
  implements NotificationChannel<EmailNotificationChannelMetadata, '', EmailRecipient>
{
  private readonly emailAdapter: EmailAdapterProvider

  constructor(awsSESProvider: AWSSESProvider) {
    this.emailAdapter = new EmailAdapterProvider(awsSESProvider)
  }

  static marshalMetadata(
    metadata: EmailNotificationChannelMetadata,
  ): EmailNotificationChannelMetadata {
    return metadata
  }

  static buildSingleRecipientFromUser(
    user: UserInterface,
    customTemplateData?: Record<string, any>,
  ): EmailRecipient {
    return {
      id: user.id,
      name: user.firstName,
      address: user.email,
      customTemplateData,
    }
  }

  static localizeMetadata(
    metadata: EmailNotificationChannelMetadata,
  ): EmailNotificationChannelMetadata[] {
    const recipientLocales = EmailNotificationChannel.getLocalesFromMetadata(metadata)

    return EmailNotificationChannel.groupMetadataByRecipientLocale(metadata, recipientLocales)
  }

  static getLocalesFromMetadata(
    metadata: EmailNotificationChannelMetadata,
    defaultLocale = 'pt-BR',
  ): string[] {
    const rawLocales: string[] = [
      defaultLocale,
      ...metadata.recipients.map((recipient) => recipient.customTemplateData?.locale),
    ]

    return uniq(rawLocales)
  }

  static groupMetadataByRecipientLocale(
    metadata: EmailNotificationChannelMetadata,
    locales: string[],
    defaultLocale = 'pt-BR',
  ): EmailNotificationChannelMetadata[] {
    const localizedMetadataHashmap: Record<string, EmailNotificationChannelMetadata> = {}

    for (const locale of locales) {
      localizedMetadataHashmap[locale] = {
        ...metadata,
        recipients: [],
        template: `${metadata.template}_${locale}`,
      }
    }

    for (const recipient of metadata.recipients) {
      const recipientLocale = recipient.customTemplateData?.locale ?? defaultLocale
      localizedMetadataHashmap[recipientLocale].recipients.push(recipient)
    }

    const localizedMetadata = Object.values(localizedMetadataHashmap)

    return localizedMetadata.filter((metadata) => metadata.recipients.length > 0)
  }

  public async dispatch(
    data: NotificationData,
    rawMetadata: EmailNotificationChannelMetadata,
  ): Promise<void> {
    const localizedMetadata = EmailNotificationChannel.localizeMetadata(rawMetadata)
    const dispatchPromises = localizedMetadata.map(async (metadata) => {
      const marshaledMetadata = EmailNotificationChannel.marshalMetadata(metadata)
      await this.emailAdapter.send(data, marshaledMetadata)
    })

    await Promise.all(dispatchPromises)
  }

  public buildRecipientsFromUsers(
    users: UserInterface[],
    usersCustomTemplateData?: Array<Record<string, any>>,
  ): EmailRecipient[] {
    const activeUsers = users.filter((user) => user.status === UserStatus.ACTIVE)
    const activeUsersId = new Set(activeUsers.map((user) => user.id))

    const filteredCustomData = usersCustomTemplateData.filter((userCustomData) =>
      activeUsersId.has(userCustomData.userId),
    )

    const recipients = activeUsers.map((user, index) =>
      EmailNotificationChannel.buildSingleRecipientFromUser(user, filteredCustomData?.[index]),
    )
    return recipients
  }
}
