import { Injectable } from '@nestjs/common'

import {
  CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE,
  CreatedKeyResultCommentActivity,
} from '@adapters/activity/activities/created-key-result-comment.activity'
import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { EmailNotificationChannel } from '@infrastructure/notification/channels/email/email.channel'
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
}

type OwnerNotificationData = {
  id: string
  firstName: string
}

type AuthorNotificationData = {
  id: string
  fullName: string
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
  owner: UserInterface
}

type CreatedKeyResultCommentMetadata = {
  keyResultOwner: UserInterface
} & NotificationMetadata

const mentionsRegex = /@\[(?<name>[\w \u00C0-\u00FF]+)]\((?<id>[\da-f-]+)\)/g
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
    const { owner, keyResult, cycle } = await this.getRelatedData(this.activity.data.keyResultId)

    const data = {
      owner: CreatedKeyResultCommentNotification.getOwnerData(owner),
      keyResult: await this.getKeyResultData(keyResult),
      cycle: this.getCycleData(cycle),
      author: await this.getAuthorData(),
      comment: this.getCommentData(),
    }

    const metadata = {
      keyResultOwner: owner,
    }

    this.data = data
    this.attachToMetadata(metadata)
  }

  public async dispatch(): Promise<void> {
    const isOwnerAuthor = this.isOwnerAuthor()
    if (isOwnerAuthor) return

    await Promise.all([this.dispatchOwnerEmail(), this.dispatchMentionsEmails()])
  }

  private async dispatchMentionsEmails(): Promise<void> {
    const marshal = this.marshal()
    const { data: genericData, metadata: genericMetadata } = marshal

    const commentContent = genericData.comment.content
    console.log(genericData)

    const mentions = [...commentContent.matchAll(mentionsRegex)]
    const usersIds = mentions.map((mention) => mention.groups.id)
    const cleanCommentContent = commentContent.replace(mentionsRegex, '$1')

    const users = await this.core.dispatchCommand<UserInterface[]>('get-users-by-ids', usersIds)

    const emailsConfig = users.map((user) => {
      const recipients = EmailNotificationChannel.buildRecipientsFromUsers([user])

      const metadata: EmailNotificationChannelMetadata = {
        ...genericMetadata,
        recipients,
        template: 'NewKeyResultCommentMention',
      }

      const data = {
        mentionedFirstName: user.firstName,
        ownerFirstName: genericData.owner.firstName,
        authorFullName: genericData.author.fullName,
        authorPictureURL: genericData.author.picture,
        keyResultTitle: genericData.keyResult.title,
        keyResultConfidenceTagColor: genericData.keyResult.confidenceColor,
        keyResultComment: cleanCommentContent,
        isQuarterlyCadence: genericData.cycle.isQuarterlyCadence,
        cyclePeriod: genericData.cycle.period,
      }

      return { data, metadata }
    })

    const emailsPromises = emailsConfig.map(async ({ data, metadata }) =>
      this.channels.email.dispatch(data, metadata),
    )

    await Promise.all(emailsPromises)
  }

  private async dispatchOwnerEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const recipients = EmailNotificationChannel.buildRecipientsFromUsers([metadata.keyResultOwner])
    const cleanCommentContent = data.comment.content.replace(mentionsRegex, '$1')

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: 'NewKeyResultComment',
    }
    const emailData = {
      ownerFirstName: data.owner.firstName,
      authorFullName: data.author.fullName,
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
    const cycle = await this.getCycle(keyResult)
    const owner = await this.core.dispatchCommand<UserInterface>('get-key-result-owner', keyResult)

    return {
      keyResult,
      cycle,
      owner,
    }
  }

  private async getAuthorData(): Promise<AuthorNotificationData> {
    const fullName = await this.core.dispatchCommand<string>(
      'get-user-full-name',
      this.activity.context.user,
    )

    return {
      fullName,
      id: this.activity.context.user.id,
      picture: this.activity.context.user.picture,
    }
  }

  private getCommentData(): CommentNotificationData {
    return {
      content: this.activity.data.text,
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

  private isOwnerAuthor(): boolean {
    return this.data.owner.id === this.data.author.id
  }
}
