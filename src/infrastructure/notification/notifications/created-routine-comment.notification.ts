import { randomUUID } from 'crypto'

import { Injectable } from '@nestjs/common'

import { GenericActivity } from '@adapters/activity/activities/generic-activity'
import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { UserProvider } from '@core/modules/user/user.provider'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { EmailNotificationChannelMetadata } from '../channels/email/metadata.type'
import { EmailRecipient } from '../types/email-recipient.type'
import { NotificationMetadata } from '../types/notification-metadata.type'

import { BaseNotification } from './base.notification'
import { GenericActivityTypes } from './generic-activity-types'
import { NotificationChannelHashMap } from './notification.factory'
import { cleanComment, getMentionedUserIdsFromComments, isTagged } from './utils'

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
    user: UserProvider,
  ) {
    super(
      activity,
      channels,
      core,
      CreatedRoutineCommentInRoutineNotification.notificationType,
      user,
    )
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

    if (data.userThatAnsweredTheRoutine.id === data.userThatCommented.id) return

    const isCommentTagged = isTagged(data.comment.content)

    if (isCommentTagged) {
      const mentionedIds = getMentionedUserIdsFromComments(data.comment.content)

      // Caso usuário x tenha recebido comentário de usuário y marcando um usuário z,
      // o usuário x e usuário z precisam ser notificados
      if (!mentionedIds.includes(data.userThatAnsweredTheRoutine.id)) {
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
          template: 'CommentInRoutine',
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

      const mentionedUsers = await this.user.getByIds(mentionedIds)

      const customDatas = mentionedUsers.map((user) => {
        return { userId: user.id, recipientFirstName: user.firstName }
      })

      const recipients = (await this.buildRecipients(
        [data.userThatAnsweredTheRoutine],
        this.channels.email,
        [...customDatas],
      )) as EmailRecipient[]

      const emailMetadata: EmailNotificationChannelMetadata = {
        ...metadata,
        recipients,
        template: 'MentionInRoutine',
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
      return
    }

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
      template: 'CommentInRoutine',
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

    if (data.userThatAnsweredTheRoutine.id === data.userThatCommented.id) return

    const isCommentTagged = isTagged(data.comment.content)

    if (isCommentTagged) {
      const mentionedIds = getMentionedUserIdsFromComments(data.comment.content)

      if (!mentionedIds.includes(data.userThatAnsweredTheRoutine.id)) {
        const recipientUsers = [data.userThatAnsweredTheRoutine]

        const messages = recipientUsers.map((recipient) => ({
          messageId: randomUUID(),
          type: 'commentOnRoutine',
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

      const mentionedUsers = await this.user.getByIds(mentionedIds)
      const recipientUsers = [...mentionedUsers]
      const messages = recipientUsers.map((recipient) => ({
        messageId: randomUUID(),
        type: 'mentionOnRoutine',
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
      return
    }

    const recipientUsers = [data.userThatAnsweredTheRoutine]

    const messages = recipientUsers.map((recipient) => ({
      messageId: randomUUID(),
      type: 'commentOnRoutine',
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
