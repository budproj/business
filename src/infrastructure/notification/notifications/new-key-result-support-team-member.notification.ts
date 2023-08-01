import { randomUUID } from 'crypto'

import { Injectable } from '@nestjs/common'

import {
  NewKeyResultSupportTeamMemberActivity,
  NEW_KEY_RESULT_SUPPORT_TEAM_MEMBER_ACTIVITY_TYPE,
} from '@adapters/activity/activities/new-key-result-support-team-member.activity'
import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { EmailNotificationChannelMetadata } from '../channels/email/metadata.type'
import { EmailRecipient } from '../types/email-recipient.type'
import { NotificationMetadata } from '../types/notification-metadata.type'

import { BaseNotification } from './base.notification'
import { NotificationChannelHashMap } from './notification.factory'

type Data = RelatedData & ResolvedData

type RelatedData = {
  author: UserInterface
  newSupportTeamMember: UserInterface
  keyResult: KeyResultInterface
  team: TeamInterface
  cycle: CycleInterface
}

type ResolvedData = {
  authorFullName: string
  authorInitials: string
  keyResultConfidenceColor: string
}

type Metadata = NotificationMetadata

@Injectable()
export class NewKeyResultSupportTeamMemberNotification extends BaseNotification<
  Data,
  Metadata,
  NewKeyResultSupportTeamMemberActivity
> {
  static activityType = NEW_KEY_RESULT_SUPPORT_TEAM_MEMBER_ACTIVITY_TYPE
  static notificationType = 'NewKeyResultSupportTeamMember'

  constructor(
    activity: NewKeyResultSupportTeamMemberActivity,
    channels: NotificationChannelHashMap,
    core: CorePortsProvider,
  ) {
    super(activity, channels, core, NewKeyResultSupportTeamMemberNotification.notificationType)
  }

  public async prepare(): Promise<void> {
    const relatedData = await this.getRelatedData()
    const resolvedData = await this.getResolvedData(relatedData)

    this.data = {
      ...relatedData,
      ...resolvedData,
    }
  }

  public async dispatch(): Promise<void> {
    await Promise.allSettled([this.dispatchSupportTeamMemberEmail(), this.dispatchSupportTeamMemberMessaging()])
  }

  private async getRelatedData(): Promise<RelatedData> {
    const author =
      this.activity.context.userWithContext ??
      (await this.core.dispatchCommand<UserInterface>('get-user', { id: this.metadata.userID }))
    const newSupportTeamMember = await this.core.dispatchCommand<UserInterface>('get-user', {
      id: this.activity.request.userId,
    })
    const keyResult = this.activity.data
    const team = await this.core.dispatchCommand<TeamInterface>('get-key-result-team', keyResult)
    const cycle = await this.core.dispatchCommand<CycleInterface>('get-key-result-cycle', keyResult)

    return {
      author,
      newSupportTeamMember,
      keyResult,
      team,
      cycle,
    }
  }

  private async getResolvedData(relatedData: RelatedData): Promise<ResolvedData> {
    const authorFullName = await this.core.dispatchCommand<string>('get-user-full-name', relatedData.author)

    const keyResultConfidenceColor = await this.core.dispatchCommand<string>(
      'get-key-result-confidence-color',
      relatedData.keyResult,
    )

    const authorInitials = await this.core.dispatchCommand<string>(
      'get-user-initials',
      this.activity.context.userWithContext,
    )

    return {
      authorFullName,
      authorInitials,
      keyResultConfidenceColor,
    }
  }

  private async dispatchSupportTeamMemberEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const recipients = (await this.buildRecipients(
      [data.newSupportTeamMember],
      this.channels.email,
    )) as EmailRecipient[]

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: 'NewKeyResultSupportTeamMember',
    }
    const emailData = {
      recipientFirstName: data.newSupportTeamMember.firstName,
      authorFirstName: data.author.firstName,
      isMaleTeam: data.team.gender === TeamGender.MALE,
      isFemaleTeam: data.team.gender === TeamGender.FEMALE,
      isQuarterlyCadence: data.cycle.cadence === Cadence.QUARTERLY,
      cyclePeriod: data.cycle.period,
      authorPictureURL: data.author.picture,
      authorFullName: data.authorFullName,
      authorInitials: data.authorInitials,
      keyResultTitle: data.keyResult.title,
      keyResultConfidenceColor: data.keyResultConfidenceColor,
      keyResultDescription: data.keyResult.description,
      keyResultTeam: data.team.name,
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }

  private async dispatchSupportTeamMemberMessaging(): Promise<void> {
    const { data, metadata } = this.marshal()

    const recipients = await this.buildRecipients([data.newSupportTeamMember], this.channels.messageBroker)

    const messages = recipients.map((recipient) => ({
      messageId: randomUUID(),
      type: 'supportTeam',
      timestamp: new Date(metadata.timestamp).toISOString(),
      recipientId: recipient.id,
      properties: {
        sender: {
          id: data.author.authzSub,
          name: data.author.firstName,
          picture: data.author.picture,
        },
        keyResult: {
          id: data.keyResult.id,
          name: data.keyResult.title,
        },
      },
    }))

    await this.channels.messageBroker.dispatchMultiple('notifications-microservice.notification', messages)
  }
}
