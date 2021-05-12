import { Injectable } from '@nestjs/common'

import {
  CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE,
  CreatedKeyResultCommentActivity,
} from '@adapters/activity/activities/created-key-result-comment.activity'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { NotificationChannel } from '@infrastructure/notification/channels/channel.interface'
import { EmailNotificationChannel } from '@infrastructure/notification/channels/email/email.channel'
import { BaseNotification } from '@infrastructure/notification/notifications/base.notification'
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
}

type KeyResultNotificationData = {
  title: string
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
    channels: Record<string, NotificationChannel>,
    core: CorePortsProvider,
  ) {
    super(activity, channels, core, CreatedKeyResultCommentNotification.notificationType)
  }

  static getOwnerData(owner: UserInterface): OwnerNotificationData {
    return {
      firstName: owner.firstName,
    }
  }

  static getKeyResultData(keyResult: KeyResultInterface): KeyResultNotificationData {
    return {
      title: keyResult.title,
    }
  }

  public async prepare(): Promise<void> {
    const { owner, keyResult } = await this.getRelatedData(this.activity.data.keyResultId)

    const data = {
      owner: CreatedKeyResultCommentNotification.getOwnerData(owner),
      keyResult: CreatedKeyResultCommentNotification.getKeyResultData(keyResult),
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

    const emailMetadata = {
      ...metadata,
      recipients,
    }

    await this.channels.email.dispatch(data, emailMetadata)
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
    }
  }

  private getCommentData(): CommentNotificationData {
    return {
      content: this.activity.data.text,
    }
  }
}
