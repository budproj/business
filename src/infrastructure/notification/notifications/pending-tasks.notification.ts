import { Injectable } from '@nestjs/common'
import { uniqBy } from 'lodash'

import { GenericActivity, GenericTypes } from '@adapters/activity/activities/generic-activity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { EmailNotificationChannelMetadata } from '../channels/email/metadata.type'
import { EmailRecipient } from '../types/email-recipient.type'
import { NotificationMetadata } from '../types/notification-metadata.type'

import { BaseNotification } from './base.notification'
import { NotificationChannelHashMap } from './notification.factory'

type Data = User[]

type RelatedData = {
  companyUsers: User[]
  usersWithPendingRoutines: User[]
}

type Metadata = NotificationMetadata

interface ActivityData {
  companyUsers: User[]
  usersWithPendingRoutines: User[]
}

@Injectable()
export class PendingTasksNotification extends BaseNotification<
  Data,
  Metadata,
  GenericActivity<ActivityData, never>
> {
  static activityType = GenericTypes
  static notificationType = 'PendenciesNotification'

  constructor(
    activity: GenericActivity<ActivityData, never>,
    channels: NotificationChannelHashMap,
    core: CorePortsProvider,
  ) {
    super(activity, channels, core, PendingTasksNotification.notificationType)
  }

  public async prepare(): Promise<void> {
    const relatedData = await this.getRelatedData()
    const resolvedData = await this.getResolvedData(relatedData)

    this.data = [...resolvedData]
  }

  public async dispatch(): Promise<void> {
    await this.dispatchPendenciesReminderEmail()
  }

  private async getRelatedData(): Promise<RelatedData> {
    const { companyUsers, usersWithPendingRoutines } = this.activity.data

    return { companyUsers, usersWithPendingRoutines }
  }

  private async getResolvedData(relatedData: RelatedData): Promise<User[]> {
    const usersWithPendingKeyResultsPromises = relatedData.companyUsers.map<
      Promise<User | undefined>
    >(async (user) => {
      const pendingKeyResults = await this.core.dispatchCommand<number>(
        'check-if-user-has-pending-key-results',
        user.id,
      )

      if (pendingKeyResults > 0) return user
    })

    const usersWithPendingKeyResults = await Promise.all(usersWithPendingKeyResultsPromises)

    const usersWithPendencies = [
      ...usersWithPendingKeyResults.filter(Boolean),
      ...relatedData.usersWithPendingRoutines,
    ]

    const uniqueArrayOfUsers = uniqBy<User>(usersWithPendencies, 'id')

    return uniqueArrayOfUsers
  }

  private async dispatchPendenciesReminderEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const customData = data.map((user) => ({
      recipientFirstName: user.firstName,
    }))

    const recipients = (await this.buildRecipients(
      data,
      this.channels.email,
      customData,
    )) as EmailRecipient[]

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: 'pendenciesReminder',
    }

    await this.channels.email.dispatch({}, emailMetadata)
  }
}
