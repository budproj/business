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

enum TASK_STATUS {
  pending = 'pending',
  toDo = 'toDo',
  doing = 'doing',
  done = 'done',
}

interface ITask {
  id: any
  boardId: any
  status: TASK_STATUS
  title: string
  description: string
  dueDate: Date
  initialDate: Date
  priority: number
  owner: string
  attachments: string[]
  supportTeamMembers: string[]
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
interface UserWithCompanies extends User {
  companies: Team[]
}

type Data = ResolvedData & RelatedData

type RelatedData = {
  userThatCommented: UserWithCompanies
  taskThatReceivedComment: ITask
  comment: Comment
}

type Metadata = NotificationMetadata

interface ActivityData {
  userThatCommented: UserWithCompanies
  taskThatReceivedComment: ITask
  comment: Comment
}

type ResolvedData = RelatedData & {
  taskId: string
  userThatCommentedInitials: string
  taskOwner: User
}

@Injectable()
export class CreatedCommentInTaskNotification extends BaseNotification<
  Data,
  Metadata,
  GenericActivity<ActivityData, never>
> {
  static activityType = GenericActivityTypes.CommentInTaskNotification
  static notificationType = 'CommentInTaskNotification'

  constructor(
    activity: GenericActivity<ActivityData, never>,
    channels: NotificationChannelHashMap,
    core: CorePortsProvider,
    user: UserProvider,
  ) {
    super(activity, channels, core, CreatedCommentInTaskNotification.notificationType, user)
  }

  public async prepare(): Promise<void> {
    const relatedData = await this.getRelatedData()
    const resolvedData = await this.getResolvedData(relatedData)

    this.data = resolvedData
  }

  public async dispatch(): Promise<void> {
    // Await this.dispatchCommentInRoutineNotificationEmail()
    await this.dispatchCommentInTaskNotificationMessage()
  }

  private async getRelatedData(): Promise<RelatedData> {
    const { comment, userThatCommented, taskThatReceivedComment } = this.activity.data

    return { comment, userThatCommented, taskThatReceivedComment }
  }

  private async getResolvedData(relatedData: RelatedData): Promise<ResolvedData> {
    const taskId: string = relatedData.comment.entity.split('routine:')[1]

    const userThatCommentedInitials = await this.core.dispatchCommand<string>(
      'get-user-initials',
      relatedData.userThatCommented,
    )
    const taskOwner = await this.core.dispatchCommand<User>('get-user', {
      id: relatedData.taskThatReceivedComment.owner,
    })

    return {
      ...relatedData,
      userThatCommentedInitials,
      taskId,
      taskOwner,
    }
  }

  private async dispatchCommentInRoutineNotificationEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    if (data.taskOwner.id === data.userThatCommented.id) return

    const isCommentTagged = isTagged(data.comment.content)

    if (isCommentTagged) {
      const mentionedIds = getMentionedUserIdsFromComments(data.comment.content)

      // Caso usuário x tenha recebido comentário de usuário y marcando um usuário z,
      // o usuário x e usuário z precisam ser notificados
      if (!mentionedIds.includes(data.taskOwner.id)) {
        const customData = {
          userId: data.taskOwner.id,
          recipientFirstName: data.taskOwner.firstName,
        }
        const recipients = (await this.buildRecipients([data.taskOwner], this.channels.email, [
          customData,
        ])) as EmailRecipient[]

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
          answerId: data.taskId,
        }

        await this.channels.email.dispatch(emailData, emailMetadata)
      }

      const mentionedUsers = await this.user.getByIds(mentionedIds)

      const customDatas = mentionedUsers.map((user) => {
        return { userId: user.id, recipientFirstName: user.firstName }
      })

      const recipients = (await this.buildRecipients([data.taskOwner], this.channels.email, [
        ...customDatas,
      ])) as EmailRecipient[]

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
        answerId: data.taskId,
      }

      await this.channels.email.dispatch(emailData, emailMetadata)
      return
    }

    const customData = {
      userId: data.taskOwner.id,
      recipientFirstName: data.taskOwner.firstName,
    }

    const recipients = (await this.buildRecipients([data.taskOwner], this.channels.email, [
      customData,
    ])) as EmailRecipient[]

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
      answerId: data.taskId,
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }

  private async dispatchCommentInTaskNotificationMessage(): Promise<void> {
    const { data, metadata } = this.marshal()

    if (data.userThatCommented.id !== data.taskOwner.id) {
      const recipientUser = data.taskOwner
      const message = {
        messageId: randomUUID(),
        type: 'commentOnTask',
        timestamp: new Date(metadata.timestamp).toISOString(),
        recipientId: recipientUser.authzSub,
        properties: {
          sender: {
            id: data.userThatCommented.authzSub,
            name: `${data.userThatCommented.firstName} ${data.userThatCommented.lastName}`,
            picture: data.userThatCommented.picture,
          },
          task: {
            companyId: data.userThatCommented.companies[0].id,
            taskId: data.taskId,
          },
          comment: {
            id: data.comment.id,
            content: data.comment.content,
          },
        },
      }
      await this.channels.messageBroker.dispatch('notifications-microservice.notification', message)
    }

    const isCommentTagged = isTagged(data.comment.content)
    if (isCommentTagged) {
      const mentionedIds = getMentionedUserIdsFromComments(data.comment.content)
      const mentionedIdsWithoutOwner = mentionedIds.filter((item) => item !== data.taskOwner.id)
      const mentionedUsers = await this.user.getByIds(mentionedIdsWithoutOwner)
      const recipientUsers = [...mentionedUsers]

      const messages = recipientUsers.map((recipient) => ({
        messageId: randomUUID(),
        type: 'mentionOnTask',
        timestamp: new Date(metadata.timestamp).toISOString(),
        recipientId: recipient.authzSub,
        properties: {
          sender: {
            id: data.userThatCommented.authzSub,
            name: `${data.userThatCommented.firstName} ${data.userThatCommented.lastName}`,
            picture: data.userThatCommented.picture,
          },
          task: {
            companyId: data.userThatCommented.companies[0].id,
            taskId: data.taskId,
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
}
