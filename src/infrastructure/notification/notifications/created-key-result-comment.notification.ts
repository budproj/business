import { Injectable } from '@nestjs/common'

import {
  CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE,
  CreatedKeyResultCommentActivity,
} from '@adapters/activity/activities/created-key-result-comment.activity'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { BaseNotification } from '@infrastructure/notification/notifications/base.notification'

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

@Injectable()
export class CreatedKeyResultCommentNotification extends BaseNotification<
  CreatedKeyResultCommentNotificationData,
  CreatedKeyResultCommentActivity
> {
  static activityType = CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE
  static notificationType = 'CreatedKeyResultComment'

  constructor(
    activity: CreatedKeyResultCommentActivity,
    protected readonly core: CorePortsProvider,
  ) {
    super(activity, CreatedKeyResultCommentNotification.notificationType)
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

  public async loadData(): Promise<void> {
    const { owner, keyResult } = await this.getRelatedData(this.activity.data.keyResultId)

    this.data = {
      owner: CreatedKeyResultCommentNotification.getOwnerData(owner),
      keyResult: CreatedKeyResultCommentNotification.getKeyResultData(keyResult),
      author: this.getAuthorData(),
      comment: this.getCommentData(),
    }
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

  private getAuthorData(): AuthorNotificationData {
    return {
      fullName: 'test',
    }
  }

  private getCommentData(): CommentNotificationData {
    return {
      content: this.activity.data.text,
    }
  }
}
