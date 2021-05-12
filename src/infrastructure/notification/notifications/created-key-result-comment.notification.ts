import { Injectable } from '@nestjs/common'

import {
  CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE,
  CreatedKeyResultCommentActivity,
} from '@adapters/activity/activities/created-key-result-comment.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { BaseNotification } from '@infrastructure/notification/notifications/base.notification'

type CreatedKeyResultCommentNotificationData = {
  owner: {
    firstName: string
  }

  author: {
    fullName: string
  }

  keyResult: {
    title: string
  }

  comment: {
    content: string
  }
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

  public async loadData(): Promise<void> {}
}
