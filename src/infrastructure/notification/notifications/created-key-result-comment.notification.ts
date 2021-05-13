import { Injectable } from '@nestjs/common'

import {
  CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE,
  CreatedKeyResultCommentActivity,
} from '@adapters/activity/activities/created-key-result-comment.activity'
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
}

type OwnerNotificationData = {
  firstName: string
}

type AuthorNotificationData = {
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

type RelatedData = {
  keyResult: KeyResultInterface
  owner: UserInterface
}

type CreatedKeyResultCommentMetadata = {
  keyResultOwner: UserInterface
} & NotificationMetadata

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
      firstName: owner.firstName,
    }
  }

  public async prepare(): Promise<void> {
    const { owner, keyResult } = await this.getRelatedData(this.activity.data.keyResultId)

    const data = {
      owner: CreatedKeyResultCommentNotification.getOwnerData(owner),
      keyResult: await this.getKeyResultData(keyResult),
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
    await this.dispatchEmail()
  }

  private async dispatchEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const recipients = EmailNotificationChannel.buildRecipientsFromUsers([metadata.keyResultOwner])

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
      keyResultComment: data.comment.content,
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }

  private async getRelatedData(keyResultID: string): Promise<RelatedData> {
    const keyResult = await this.core.dispatchCommand<KeyResultInterface>('get-key-result', {
      id: keyResultID,
    })
    const owner = await this.core.dispatchCommand<UserInterface>('get-key-result-owner', keyResult)

    return {
      keyResult,
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
}
