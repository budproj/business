import { Injectable } from '@nestjs/common'

import {
  CREATED_KEY_RESULT_CHECKMARK_ACTIVITY_TYPE,
  CreatedKeyResultCheckMarkActivity,
} from '@adapters/activity/activities/created-key-result-checkmark.activity'
import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { CheckMarkStates } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserGender } from '@core/modules/user/enums/user-gender.enum'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { EmailNotificationChannelMetadata } from '@infrastructure/notification/channels/email/metadata.type'
import { BaseNotification } from '@infrastructure/notification/notifications/base.notification'
import { ChannelHashmap } from '@infrastructure/notification/types/channel-hashmap.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'

type CreatedKeyResultCheckMarkNotificationData = {
  owner: OwnerNotificationData
  author: AuthorNotificationData
  keyResult: KeyResultNotificationData
  checkMark: CheckMarkNotificationData
  cycle: CycleNotificationData
  team: TeamNotificationData
  assignedUser: UserInterface
  checkMarkCreator: UserInterface
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
  id: string
  title: string
  confidenceColor: string
}

type CheckMarkNotificationData = {
  state: CheckMarkStates
  description: string
  updatedAt: Date
  keyResultId: KeyResultInterface['id']
  creatorId: UserInterface['id']
  assignedUserId: UserInterface['id']
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
  assignedUser: UserInterface
  checkMarkCreator: UserInterface
}

type CreatedKeyResultCheckMarkMetadata = {
  keyResultOwner: UserInterface
  supportTeam: UserInterface[]
} & NotificationMetadata

@Injectable()
export class CreatedKeyResultCheckMarkNotification extends BaseNotification<
  CreatedKeyResultCheckMarkNotificationData,
  CreatedKeyResultCheckMarkMetadata,
  CreatedKeyResultCheckMarkActivity
> {
  static activityType = CREATED_KEY_RESULT_CHECKMARK_ACTIVITY_TYPE
  static notificationType = 'CreatedKeyResultCheckMark'

  constructor(
    activity: CreatedKeyResultCheckMarkActivity,
    channels: ChannelHashmap,
    core: CorePortsProvider,
  ) {
    super(activity, channels, core, CreatedKeyResultCheckMarkNotification.notificationType)
  }

  static getOwnerData(owner: UserInterface): OwnerNotificationData {
    return {
      id: owner.id,
      firstName: owner.firstName,
    }
  }

  public async prepare(): Promise<void> {
    const { owner, keyResult, cycle, team, supportTeam, assignedUser, checkMarkCreator } =
      await this.getRelatedData(
        this.activity.data.keyResultId,
        this.activity.data.assignedUserId,
        this.activity.data.userId,
      )

    const data: CreatedKeyResultCheckMarkNotificationData = {
      owner: CreatedKeyResultCheckMarkNotification.getOwnerData(owner),
      keyResult: await this.getKeyResultData(keyResult),
      cycle: this.getCycleData(cycle),
      author: await this.getAuthorData(),
      checkMark: this.getCheckMarkData(),
      team: this.getTeamData(team),
      assignedUser,
      checkMarkCreator,
    }

    const metadata = {
      supportTeam,
      keyResultOwner: owner,
    }

    this.data = data
    this.attachToMetadata(metadata)
  }

  public async dispatch(): Promise<void> {
    await this.dispatchAssignedCheckMarkEmail()
  }

  private async dispatchAssignedCheckMarkEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    if (data.assignedUser.id === data.author.id) return

    const recipientUsers = [data.assignedUser]
    const customData = recipientUsers.map((user) => ({
      ownerFirstName: user.firstName,
    }))
    const recipients = await this.buildRecipients(recipientUsers, customData)

    if (recipients.length === 0) return

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: 'AssignedUserCheckmark',
    }

    const assignedUserFullName = await this.core.dispatchCommand<string>(
      'get-user-full-name',
      data.assignedUser,
    )

    const emailData = {
      assignedUserFullName,
      assignedUserFirstName: data.assignedUser.firstName,
      isMale: data.assignedUser.gender === UserGender.MALE,
      isFemale: data.assignedUser.gender === UserGender.FEMALE,
      assignedUserPicture: data.assignedUser.picture,

      actionUserFullName: data.author.fullName,
      actionUserPicture: data.author.picture,
      authorInitials: data.author.initials,

      checkMarkDescription: data.checkMark.description,
      isCheckMarkChecked: data.checkMark.state === CheckMarkStates.CHECKED,
      teamId: data.team.id,

      isQuarterlyCadence: data.cycle.isQuarterlyCadence,
      cyclePeriod: data.cycle.period,
      keyResultConfidenceColor: data.keyResult.confidenceColor,
      keyResultTitle: data.keyResult.title,
      keyResultId: data.keyResult.id,
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }

  private async getRelatedData(
    keyResultID: string,
    assignedUserID: string,
    creatorId: string,
  ): Promise<RelatedData> {
    const keyResult = await this.core.dispatchCommand<KeyResultInterface>('get-key-result', {
      id: keyResultID,
    })
    const [cycle, team, owner, supportTeam, assignedUser, checkMarkCreator] = await Promise.all([
      this.getCycle(keyResult),
      this.getTeam(keyResult),
      this.core.dispatchCommand<UserInterface>('get-key-result-owner', keyResult),
      this.core.dispatchCommand<UserInterface[]>('get-key-result-support-team', keyResult.id),
      this.core.dispatchCommand<UserInterface>('get-user', assignedUserID),
      this.core.dispatchCommand<UserInterface>('get-user', creatorId),
    ])

    return {
      keyResult,
      cycle,
      team,
      owner,
      supportTeam,
      assignedUser,
      checkMarkCreator,
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

  private getCheckMarkData(): CheckMarkNotificationData {
    return {
      state: this.activity.data.state,
      description: this.activity.data.description,
      updatedAt: this.activity.data.updatedAt,
      keyResultId: this.activity.data.keyResultId,
      creatorId: this.activity.data.userId,
      assignedUserId: this.activity.data.assignedUserId,
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
      id: keyResult.id,
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
