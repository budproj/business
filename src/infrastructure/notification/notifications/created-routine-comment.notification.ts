import { randomUUID } from 'crypto'

import { Injectable } from '@nestjs/common'

import { GenericActivity } from '@adapters/activity/activities/generic-activity'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { EmailNotificationChannelMetadata } from '../channels/email/metadata.type'
import { EmailRecipient } from '../types/email-recipient.type'
import { NotificationMetadata } from '../types/notification-metadata.type'

import { BaseNotification } from './base.notification'
import { GenericActivityTypes } from './generic-activity-types'
import { NotificationChannelHashMap } from './notification.factory'
import { cleanComment, isTagged } from './utils'

interface Comment {
  id: string
  entity: string
  userId: string
  content: string
  createdAt: Date
}

interface UserWithCompanies extends User {
  companies: Team[]
}

type Data = ResolvedData & RelatedData

type RelatedData = {
  userThatCommented: UserWithCompanies
  answeredRoutine: { userId: string }
  comment: Comment
}

type Metadata = NotificationMetadata

interface ActivityData {
  userThatCommented: UserWithCompanies
  answeredRoutine: { userId: string }
  comment: Comment
}

type ResolvedData = {
  userThatCommented: UserWithCompanies
  answeredRoutine: { userId: string }
  comment: Comment
  answerId: string
  userThatCommentedInitials: string
  userThatAnsweredTheRoutine: User
}

@Injectable()
export class CreatedRoutineCommentInRoutineNotification extends BaseNotification<
  Data,
  Metadata,
  GenericActivity<ActivityData, never>
> {
  static activityType = GenericActivityTypes.CommentInRoutineNotification
  static notificationType = 'CommentInRoutineNotification'

  constructor(
    activity: GenericActivity<ActivityData, never>,
    channels: NotificationChannelHashMap,
    core: CorePortsProvider,
  ) {
    super(activity, channels, core, CreatedRoutineCommentInRoutineNotification.notificationType)
  }

  public async prepare(): Promise<void> {
    const relatedData = await this.getRelatedData()
    const resolvedData = await this.getResolvedData(relatedData)

    this.data = resolvedData
  }

  public async dispatch(): Promise<void> {
    await this.dispatchCommentInRoutineNotificationEmail()
    await this.dispatchCommentInRoutineNotificationMessage()
  }

  private async getRelatedData(): Promise<RelatedData> {
    const { comment, userThatCommented, answeredRoutine } = this.activity.data

    return { comment, userThatCommented, answeredRoutine }
  }

  private async getResolvedData(relatedData: RelatedData): Promise<ResolvedData> {
    const answerId = relatedData.comment.entity.split('routine:')[1]

    const userThatCommentedInitials = await this.core.dispatchCommand<string>(
      'get-user-initials',
      relatedData.userThatCommented,
    )

    const userThatAnsweredTheRoutine = await this.core.dispatchCommand<User>('get-user', {
      id: relatedData.answeredRoutine.userId,
    })

    return {
      ...relatedData,
      userThatCommentedInitials,
      answerId,
      userThatAnsweredTheRoutine,
    }
  }

  private async dispatchCommentInRoutineNotificationEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const isCommentTagged = isTagged(data.comment.content)

    // If (isCommentTagged) {
    //   const mentionedIds = getMentionedUserIdsFromComments(data.comment.content)
    //   const mentionedUsers = await Promise.all(
    //     mentionedIds.map(async (userId) =>
    //       this.core.dispatchCommand<User>('get-user', {
    //         id: userId,
    //       }),
    //     ),
    //   )

    //   const customDatas = mentionedUsers.map((user) => {
    //     return { userId: user.id, recipientFirstName: user.firstName }
    //   })
    // }

    const customData = {
      userId: data.userThatAnsweredTheRoutine.id,
      recipientFirstName: data.userThatAnsweredTheRoutine.firstName,
    }

    const recipients = (await this.buildRecipients(
      [data.userThatAnsweredTheRoutine],
      this.channels.email,
      [customData],
    )) as EmailRecipient[]

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: isCommentTagged ? 'MentionInRoutine' : 'CommentInRoutine',
    }

    const emailData = {
      firstName: data.userThatCommented.firstName,
      lastName: data.userThatCommented.lastName,
      authorInitials: data.userThatCommentedInitials,
      authorPictureURL: data.userThatCommented.picture,
      companyId: data.userThatCommented.companies[0].id,
      commentText: cleanComment(data.comment.content),
      answerId: data.answerId,
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }

  private async dispatchCommentInRoutineNotificationMessage(): Promise<void> {
    const { data, metadata } = this.marshal()

    const recipientUsers = [data.userThatAnsweredTheRoutine]

    const isCommentTagged = isTagged(data.comment.content)

    const messages = recipientUsers.map((recipient) => ({
      messageId: randomUUID(),
      type: isCommentTagged ? 'mentionOnRoutine' : 'commentOnRoutine',
      timestamp: new Date(metadata.timestamp).toISOString(),
      recipientId: recipient.authzSub,
      properties: {
        sender: {
          id: data.userThatCommented.authzSub,
          name: `${data.userThatCommented.firstName} ${data.userThatCommented.lastName}`,
          picture: data.userThatCommented.picture,
        },
        routine: {
          companyId: data.userThatCommented.companies[0].id,
          answerId: data.answerId,
        },
        comment: {
          id: data.comment.id,
          content: data.comment.content,
        },
      },
    }))

    await this.channels.messageBroker.dispatchMultiple(
      'notifications-microservice.notification',
      messages,
    )
  }
}
