import { Injectable } from '@nestjs/common'
import { uniqBy } from 'lodash'

import {
  CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE,
  CreatedKeyResultCommentActivity,
} from '@adapters/activity/activities/created-key-result-comment.activity'
import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { EmailNotificationChannelMetadata } from '@infrastructure/notification/channels/email/metadata.type'
import { BaseNotification } from '@infrastructure/notification/notifications/base.notification'
import { ChannelHashmap } from '@infrastructure/notification/types/channel-hashmap.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'

type CreatedKeyResultCommentNotificationData = {
  owner: OwnerNotificationData
  author: AuthorNotificationData
  keyResult: KeyResultNotificationData
  comment: CommentNotificationData
  cycle: CycleNotificationData
  team: TeamNotificationData
}

type TeamNotificationData = {
  id: string
  name: string
  gender: TeamGender
}

type OwnerNotificationData = {
  id: string
  firstName: string
}

type AuthorNotificationData = {
  id: string
  fullName: string
  initials: string
  picture: string
}

type KeyResultNotificationData = {
  title: string
  confidenceColor: string
}

type CommentNotificationData = {
  content: string
}

type CycleNotificationData = {
  isQuarterlyCadence: boolean
  period: string
}

type RelatedData = {
  keyResult: KeyResultInterface
  cycle: CycleInterface
  team: TeamInterface
  owner: UserInterface
  supportTeam: UserInterface[]
}

type CreatedKeyResultCommentMetadata = {
  keyResultOwner: UserInterface
  supportTeam: UserInterface[]
} & NotificationMetadata

const mentionsRegex = /@\[(?<name>[\w \u00C0-\u00FF-]+)]\((?<id>[\da-f-]+)\)/g
@Injectable()
export class CreatedKeyResultCommentNotification extends BaseNotification<
  CreatedKeyResultCommentNotificationData,
  CreatedKeyResultCommentMetadata,
  CreatedKeyResultCommentActivity
> {
  static activityType = CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE
  static notificationType = 'CreatedKeyResultComment'

  constructor(
    activity: CreatedKeyResultCommentActivity,
    channels: ChannelHashmap,
    core: CorePortsProvider,
  ) {
    super(activity, channels, core, CreatedKeyResultCommentNotification.notificationType)
  }

  static getOwnerData(owner: UserInterface): OwnerNotificationData {
    return {
      id: owner.id,
      firstName: owner.firstName,
    }
  }

  public async prepare(): Promise<void> {
    const { owner, keyResult, cycle, team, supportTeam } = await this.getRelatedData(
      this.activity.data.keyResultId,
    )

    const data = {
      owner: CreatedKeyResultCommentNotification.getOwnerData(owner),
      keyResult: await this.getKeyResultData(keyResult),
      cycle: this.getCycleData(cycle),
      author: await this.getAuthorData(),
      comment: this.getCommentData(),
      team: this.getTeamData(team),
    }

    const metadata = {
      supportTeam,
      keyResultOwner: owner,
    }

    this.data = data
    this.attachToMetadata(metadata)
  }

  public async dispatch(): Promise<void> {
    await Promise.all([this.dispatchOwnerAndSupportTeamEmail(), this.dispatchMentionsEmails()])
  }

  private async dispatchMentionsEmails(): Promise<void> {
    const marshal = this.marshal()
    const { data: genericData, metadata: genericMetadata } = marshal

    const commentContent = genericData.comment.content
    const cleanCommentContent = commentContent.replace(mentionsRegex, '$1')

    const mentions = [...commentContent.matchAll(mentionsRegex)]
    const usersIds = mentions.map((mention) => mention.groups.id)

    const users = await this.core.dispatchCommand<UserInterface[]>('get-users-by-ids', usersIds)

    const customData = users.map((user) => ({
      mentionedFirstName: user.firstName,
    }))
    const recipients = await this.buildRecipients(users, customData)
    const metadata: EmailNotificationChannelMetadata = {
      ...genericMetadata,
      recipients,
      template: 'NewKeyResultCommentMention',
    }

    const emailData = {
      authorFirstName: genericData.owner.firstName,
      teamId: genericData.team.id,
      keyResultTeam: genericData.team.name,
      isMaleTeam: genericData.team.gender === TeamGender.MALE,
      isFemaleTeam: genericData.team.gender === TeamGender.FEMALE,
      authorFullName: genericData.author.fullName,
      authorPictureURL: genericData.author.picture,
      authorInitials: genericData.author.initials,
      keyResultTitle: genericData.keyResult.title,
      keyResultConfidenceTagColor: genericData.keyResult.confidenceColor,
      keyResultComment: cleanCommentContent,
      isQuarterlyCadence: genericData.cycle.isQuarterlyCadence,
      cyclePeriod: genericData.cycle.period,
    }

    await this.channels.email.dispatch(emailData, metadata)
  }

  private async dispatchOwnerAndSupportTeamEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const cleanCommentContent = data.comment.content.replace(mentionsRegex, '$1')
    const recipientUsers = uniqBy([metadata.keyResultOwner, ...metadata.supportTeam], 'id').filter(
      (user) => user.id !== data.author.id,
    )
    const customData = recipientUsers.map((user) => ({
      ownerFirstName: user.firstName,
    }))
    const recipients = await this.buildRecipients(recipientUsers, customData)

    if (recipients.length === 0) return

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: 'NewKeyResultComment',
    }
    const emailData = {
      authorFullName: data.author.fullName,
      authorInitials: data.author.initials,
      authorPictureURL: data.author.picture,
      keyResultTitle: data.keyResult.title,
      keyResultConfidenceTagColor: data.keyResult.confidenceColor,
      keyResultComment: cleanCommentContent,
      isQuarterlyCadence: data.cycle.isQuarterlyCadence,
      cyclePeriod: data.cycle.period,
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }

  private async getRelatedData(keyResultID: string): Promise<RelatedData> {
    const keyResult = await this.core.dispatchCommand<KeyResultInterface>('get-key-result', {
      id: keyResultID,
    })
    const [cycle, team, owner, supportTeam] = await Promise.all([
      this.getCycle(keyResult),
      this.getTeam(keyResult),
      this.core.dispatchCommand<UserInterface>('get-key-result-owner', keyResult),
      this.core.dispatchCommand<UserInterface[]>('get-key-result-support-team', keyResult.id),
    ])

    return {
      keyResult,
      cycle,
      team,
      owner,
      supportTeam,
    }
  }

  private async getAuthorData(): Promise<AuthorNotificationData> {
    const fullName = await this.core.dispatchCommand<string>(
      'get-user-full-name',
      this.activity.context.userWithContext,
    )

    const initials = await this.core.dispatchCommand<string>(
      'get-user-initials',
      this.activity.context.userWithContext,
    )

    return {
      fullName,
      initials,
      id: this.activity.context.userWithContext.id,
      picture: this.activity.context.userWithContext.picture,
    }
  }

  private getCommentData(): CommentNotificationData {
    return {
      content: this.activity.data.text,
    }
  }

  private getTeamData(team: TeamInterface): TeamNotificationData {
    return {
      id: team.id,
      name: team.name,
      gender: team.gender,
    }
  }

  private async getKeyResultData(
    keyResult: KeyResultInterface,
  ): Promise<KeyResultNotificationData> {
    const confidenceColor = await this.core.dispatchCommand<string>(
      'get-key-result-confidence-color',
      keyResult,
    )

    return {
      confidenceColor,
      title: keyResult.title,
    }
  }

  private getCycleData(cycle: CycleInterface): CycleNotificationData {
    return {
      isQuarterlyCadence: cycle.cadence === Cadence.QUARTERLY,
      period: cycle.period,
    }
  }

  private async getCycle(keyResult: KeyResultInterface): Promise<CycleInterface> {
    return this.core.dispatchCommand<CycleInterface>('get-key-result-cycle', keyResult)
  }

  private async getTeam(keyResult: KeyResultInterface): Promise<TeamInterface> {
    return this.core.dispatchCommand<TeamInterface>('get-key-result-team', keyResult)
  }
}
