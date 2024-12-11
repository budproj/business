import { randomUUID } from 'crypto'

import { Injectable } from '@nestjs/common'
import { uniqBy } from 'lodash'

import {
  CreatedCheckInActivity,
  CREATED_CHECK_IN_ACTIVITY_TYPE,
} from '@adapters/activity/activities/created-check-in-activity'
import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { CONFIDENCE_TAG_THRESHOLDS } from '@adapters/confidence-tag/confidence-tag.constants'
import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { GetTeamMembersCommandResult } from '@core/ports/commands/get-team-members.command'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { EmailNotificationChannelMetadata } from '../channels/email/metadata.type'
import { EmailRecipient } from '../types/email-recipient.type'
import { NotificationMetadata } from '../types/notification-metadata.type'

import { BaseNotification } from './base.notification'
import { NotificationChannelHashMap } from './notification.factory'
import { cleanComment, getMentionedUserIdsFromComments } from './utils'

type CreatedCheckInData = RelatedData & ResolvedData

type KeyResultWithColor = {
  confidenceColor: string
} & KeyResultInterface

type CreatedCheckInMetadata = {
  teamMembers: UserInterface[]
  keyResultOwner: UserInterface
  supportTeam: UserInterface[]
} & NotificationMetadata

type RelatedData = {
  keyResultOwner: UserInterface
  team: TeamInterface
  author: UserInterface
  cycle: CycleInterface
  keyResult: KeyResultWithColor
  teamMembers: UserInterface[]
  parentCheckIn?: KeyResultCheckInInterface
}

type ResolvedData = {
  checkIn: KeyResultCheckInInterface
  author: UserInterface
  authorFullName: string
  authorInitials: string
  previousCheckInConfidenceColor: string
  previousCheckInConfidenceBackgroundColor: string
  hasPreviousCheckIn: boolean
}

@Injectable()
export class CreatedKeyResultCheckInNotification extends BaseNotification<
  CreatedCheckInData,
  CreatedCheckInMetadata,
  CreatedCheckInActivity
> {
  static activityType = CREATED_CHECK_IN_ACTIVITY_TYPE
  static notificationType = 'CreatedKeyResultCheckIn'
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(
    activity: CreatedCheckInActivity,
    channels: NotificationChannelHashMap,
    core: CorePortsProvider,
  ) {
    super(activity, channels, core, CreatedKeyResultCheckInNotification.notificationType)
  }

  public async prepare(): Promise<void> {
    const { keyResult, keyResultOwner, parentCheckIn, teamMembers, team, cycle } =
      await this.getRelatedData(this.activity.data)
    const resolvedData = await this.getResolvedData(parentCheckIn)

    const supportTeam = await this.core.dispatchCommand<UserInterface[]>(
      'get-key-result-support-team',
      keyResult.id,
    )

    const data = {
      keyResultOwner,
      teamMembers,
      parentCheckIn,
      team,
      cycle,
      keyResult,
      ...resolvedData,
    }

    const metadata = {
      keyResultOwner,
      teamMembers,
      supportTeam,
    }

    this.data = data
    this.attachToMetadata(metadata)
  }

  public async dispatch(): Promise<void> {
    const { data } = this.marshal()
    const mentionedIds = getMentionedUserIdsFromComments(data.checkIn.comment)

    if (mentionedIds.length > 0) {
      await this.dispatchMentions()
    }

    if (
      data.checkIn.confidence === CONFIDENCE_TAG_THRESHOLDS.barrier &&
      data.parentCheckIn?.confidence !== CONFIDENCE_TAG_THRESHOLDS.barrier
    ) {
      await this.dispatchBarrierEmail()
      await this.dispatchBarrierOrLowConfidenceMessaging()
    }

    if (
      data.checkIn.confidence === CONFIDENCE_TAG_THRESHOLDS.low &&
      data.parentCheckIn?.confidence !== CONFIDENCE_TAG_THRESHOLDS.low
    ) {
      await this.dispatchLowConfidenceEmail()
      await this.dispatchBarrierOrLowConfidenceMessaging()
    }
  }

  private async getRelatedData(checkIn: KeyResultCheckInInterface): Promise<RelatedData> {
    const keyResult = await this.core.dispatchCommand<KeyResultWithColor>('get-key-result', {
      id: checkIn.keyResultId,
    })
    keyResult.confidenceColor = await this.core.dispatchCommand<string>(
      'get-key-result-confidence-color',
      keyResult,
    )
    const cycle = await this.core.dispatchCommand<CycleInterface>('get-key-result-cycle', keyResult)
    const parentCheckIn = await this.core.dispatchCommand<KeyResultCheckInInterface>(
      'get-key-result-check-in',
      {
        id: checkIn.parentId,
      },
    )

    const keyResultOwner = await this.core.dispatchCommand<UserInterface>(
      'get-key-result-owner',
      keyResult,
    )

    const author = await this.core.dispatchCommand<UserInterface>('get-user', {
      id: checkIn.userId,
    })

    const team = await this.core.dispatchCommand<TeamInterface>('get-team', {
      id: keyResult.teamId,
    })

    const { users: keyResultTeamMembers, teams } = keyResult.teamId
      ? await this.core.dispatchCommand<GetTeamMembersCommandResult>(
          'get-team-members',
          keyResult.teamId,
        )
      : { users: [], teams: [] }

    const keyResultSupportTeamMembers = await this.core.dispatchCommand<UserInterface[]>(
      'get-key-result-support-team',
      keyResult.id,
    )

    const keyResultMembers = uniqBy(
      [keyResultOwner, ...keyResultTeamMembers, ...keyResultSupportTeamMembers],
      'id',
    )

    const teamMembers = keyResultMembers.filter((member) => member.id !== author.id)

    return {
      keyResultOwner,
      keyResult,
      cycle,
      team,
      parentCheckIn,
      teamMembers,
      author,
    }
  }

  private async getResolvedData(parentCheckIn: KeyResultCheckInInterface): Promise<ResolvedData> {
    const authorFullName = await this.core.dispatchCommand<string>(
      'get-user-full-name',
      this.activity.context.userWithContext,
    )

    const previousCheckInConfidenceColor = this.confidenceTagAdapter.getPrimaryColorFromConfidence(
      parentCheckIn?.confidence,
    )
    const previousCheckInConfidenceBackgroundColor =
      this.confidenceTagAdapter.getBackgroundColorFromConfidence(parentCheckIn?.confidence)

    const authorInitials = await this.core.dispatchCommand<string>(
      'get-user-initials',
      this.activity.context.userWithContext,
    )

    return {
      authorFullName,
      authorInitials,
      previousCheckInConfidenceColor,
      previousCheckInConfidenceBackgroundColor,
      checkIn: this.activity.data,
      author: this.activity.context.userWithContext,
      hasPreviousCheckIn: Boolean(parentCheckIn),
    }
  }

  private async dispatchBarrierEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const customData = metadata.teamMembers.map((member) => ({
      userId: member.id,
      recipientFirstName: member.firstName,
    }))

    const recipients = (await this.buildRecipients(
      metadata.teamMembers,
      this.channels.email,
      customData,
    )) as EmailRecipient[]

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: 'KeyResultWithBarrier',
    }
    const emailData = {
      isMaleTeam: data.team.gender === TeamGender.MALE,
      isFemaleTeam: data.team.gender === TeamGender.FEMALE,
      teamName: data.team.name,
      authorFirstName: data.author.firstName,
      authorInitials: data.authorInitials,
      isQuarterlyCadence: data.cycle.cadence === Cadence.QUARTERLY,
      cyclePeriod: data.cycle.period,
      authorPictureURL: data.author.picture,
      authorFullName: data.authorFullName,
      keyResultTitle: data.keyResult.title,
      keyResultPreviousConfidenceTagColorPrimary: data.previousCheckInConfidenceColor,
      keyResultPreviousConfidenceTagColorBackground: data.previousCheckInConfidenceBackgroundColor,
      keyResultComment: data.checkIn.comment,
      keyResultId: data.keyResult.id,
      hasPreviousCheckIn: data.hasPreviousCheckIn,
      wasHighConfidence: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.high,
      wasMediumConfidence: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.medium,
      wasLowConfidence: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.low,
      hasComment: data.checkIn.comment?.length > 0,
      teamID: data.team.id,
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }

  private async dispatchMentions(): Promise<void> {
    await Promise.all([this.dispatchMentionsEmails(), this.dispatchMentionsMessaging()])
  }

  private async dispatchMentionsMessaging(): Promise<void> {
    const { data, metadata } = this.marshal()

    const commentContent = data.checkIn.comment
    const mentionedIds = getMentionedUserIdsFromComments(commentContent)
    const supportTeam = metadata.supportTeam.filter((user) => user !== undefined)
    const ownerAndSupportTeamIds = uniqBy([metadata.keyResultOwner, ...supportTeam], 'id')

    const recipientIds = mentionedIds.filter(
      (userId) => !ownerAndSupportTeamIds.map((user) => user.id).includes(userId),
    )

    const recipients = await this.core.dispatchCommand<UserInterface[]>(
      'get-users-by-ids',
      recipientIds,
    )

    const messages = recipients.map((recipient) => ({
      messageId: randomUUID(),
      type: 'taggedInComment',
      timestamp: new Date(metadata.timestamp).toISOString(),
      recipientId: recipient.authzSub,
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
        comment: {
          id: data.checkIn.id,
          content: data.checkIn.comment,
        },
      },
    }))

    await this.channels.messageBroker.dispatchMultiple(
      'notifications-microservice.notification',
      messages,
    )
  }

  private async dispatchMentionsEmails(): Promise<void> {
    const marshal = this.marshal()
    const { data: genericData, metadata: genericMetadata } = marshal

    const commentContent = genericData.checkIn.comment
    const cleanCommentContent = cleanComment(commentContent)
    const mentionedIds = getMentionedUserIdsFromComments(commentContent)

    const ownerAndSupportTeamIds = uniqBy(
      [genericMetadata.keyResultOwner, ...genericMetadata.teamMembers],
      'id',
    )

    const recipientIds = mentionedIds.filter(
      (userId) => !ownerAndSupportTeamIds.map((user) => user.id).includes(userId),
    )

    const users = await this.core.dispatchCommand<UserInterface[]>('get-users-by-ids', recipientIds)

    const customData = users.map((user) => ({
      userId: user.id,
      mentionedFirstName: user.firstName,
    }))

    const recipients = (await this.buildRecipients(
      users,
      this.channels.email,
      customData,
    )) as EmailRecipient[]

    const metadata: EmailNotificationChannelMetadata = {
      ...genericMetadata,
      recipients,
      template: 'NewKeyResultCommentMention',
    }

    const emailData = {
      authorFirstName: genericData.authorInitials,
      teamId: genericData.team.id,
      keyResultTeam: genericData.team.name,
      isMaleTeam: genericData.team.gender === TeamGender.MALE,
      isFemaleTeam: genericData.team.gender === TeamGender.FEMALE,
      authorFullName: genericData.author.fullName,
      authorPictureURL: genericData.author.picture,
      authorInitials: genericData.authorInitials,
      keyResultTitle: genericData.keyResult.title,
      keyResultConfidenceTagColor: genericData.keyResult.confidenceColor,
      keyResultComment: cleanCommentContent,
      keyResultId: genericData.keyResult.id,
    }

    await this.channels.email.dispatch(emailData, metadata)
  }

  private async dispatchLowConfidenceEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const customData = metadata.teamMembers.map((member) => ({
      userId: member.id,
      recipientFirstName: member.firstName,
    }))

    const recipients = (await this.buildRecipients(
      metadata.teamMembers,
      this.channels.email,
      customData,
    )) as EmailRecipient[]

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: 'KeyResultWithLowConfidence',
    }
    const emailData = {
      isMaleTeam: data.team.gender === TeamGender.MALE,
      isFemaleTeam: data.team.gender === TeamGender.FEMALE,
      teamName: data.team.name,
      authorFirstName: data.author.firstName,
      isQuarterlyCadence: data.cycle.cadence === Cadence.QUARTERLY,
      cyclePeriod: data.cycle.period,
      authorPictureURL: data.author.picture,
      authorFullName: data.authorFullName,
      authorInitials: data.authorInitials,
      keyResultTitle: data.keyResult.title,
      keyResultPreviousConfidenceTagColorPrimary: data.previousCheckInConfidenceColor,
      keyResultPreviousConfidenceTagColorBackground: data.previousCheckInConfidenceBackgroundColor,
      keyResultComment: data.checkIn.comment,
      keyResultId: data.keyResult.id,
      hasPreviousCheckIn: data.hasPreviousCheckIn,
      wasHighConfidence: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.high,
      wasMediumConfidence: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.medium,
      wasWithBarrier: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.barrier,
      hasComment: data.checkIn.comment?.length > 0,
      teamID: data.team.id,
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }

  private async dispatchBarrierOrLowConfidenceMessaging(): Promise<void> {
    const { data, metadata } = this.marshal()

    const notificationRecipients = await this.buildRecipients(
      metadata.teamMembers,
      this.channels.messageBroker,
    )

    const messages = notificationRecipients.map((recipient) => ({
      messageId: randomUUID(),
      type: 'checkin',
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
        previousConfidance: data.parentCheckIn?.confidence,
        newConfidence: data.checkIn.confidence,
      },
    }))

    await this.channels.messageBroker.dispatchMultiple(
      'notifications-microservice.notification',
      messages,
    )
  }
}
