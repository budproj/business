import { Injectable } from '@nestjs/common'

import {
  CreatedCheckInActivity,
  CREATED_CHECK_IN_ACTIVITY_TYPE,
} from '@adapters/activity/activities/created-check-in-activity'
import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { CONFIDENCE_TAG_THRESHOLDS } from '@adapters/confidence-tag/confidence-tag.constants'
import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { TeamGender } from '@core/modules/team/enums/team-gender.enum'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { EmailNotificationChannel } from '../channels/email/email.channel'
import { EmailNotificationChannelMetadata } from '../channels/email/metadata.type'
import { ChannelHashmap } from '../types/channel-hashmap.type'
import { NotificationMetadata } from '../types/notification-metadata.type'

import { BaseNotification } from './base.notification'

type CreatedCheckInData = RelatedData & ResolvedData

type CreatedCheckInMetadata = {
  teamMembers: UserInterface[]
} & NotificationMetadata

type RelatedData = {
  team: TeamInterface
  author: UserInterface
  cycle: CycleInterface
  keyResult: KeyResultInterface
  teamMembers: UserInterface[]
  parentCheckIn?: KeyResultCheckInInterface
}

type ResolvedData = {
  checkIn: KeyResultCheckInInterface
  author: UserInterface
  authorFullName: string
  previousCheckInConfidenceColor: string
  previousCheckInConfidenceBackgroundColor: string
  hasPreviousCheckIn: boolean
}

@Injectable()
export class CreatedKeyResultCheckInNotification extends BaseNotification<
  CreatedCheckInData,
  CreatedCheckInMetadata,
  CreatedCheckInActivity
> {
  static activityType = CREATED_CHECK_IN_ACTIVITY_TYPE
  static notificationType = 'CreatedKeyResultCheckIn'
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(activity: CreatedCheckInActivity, channels: ChannelHashmap, core: CorePortsProvider) {
    super(activity, channels, core, CreatedKeyResultCheckInNotification.notificationType)
  }

  public async prepare(): Promise<void> {
    const { parentCheckIn, teamMembers, ...relatedData } = await this.getRelatedData(
      this.activity.data,
    )
    const resolvedData = await this.getResolvedData(parentCheckIn)

    const data = {
      teamMembers,
      parentCheckIn,
      ...relatedData,
      ...resolvedData,
    }

    const metadata = {
      teamMembers,
    }

    this.data = data
    this.attachToMetadata(metadata)
  }

  public async dispatch(): Promise<void> {
    const { data } = this.marshal()

    if (
      data.checkIn.confidence === CONFIDENCE_TAG_THRESHOLDS.barrier &&
      data.parentCheckIn?.confidence !== CONFIDENCE_TAG_THRESHOLDS.barrier
    )
      void this.dispatchBarrierEmail()
  }

  private async getRelatedData(checkIn: KeyResultCheckInInterface): Promise<RelatedData> {
    const keyResult = await this.core.dispatchCommand<KeyResultInterface>('get-key-result', {
      id: checkIn.keyResultId,
    })
    const cycle = await this.core.dispatchCommand<CycleInterface>('get-key-result-cycle', keyResult)
    const parentCheckIn = await this.core.dispatchCommand<KeyResultCheckInInterface>(
      'get-key-result-check-in',
      {
        id: checkIn.parentId,
      },
    )

    const author = await this.core.dispatchCommand<UserInterface>('get-user', {
      id: checkIn.userId,
    })

    const team = await this.core.dispatchCommand<TeamInterface>('get-team', {
      id: keyResult.teamId,
    })
    const teamMembers = await this.core.dispatchCommand<UserInterface[]>(
      'get-team-members',
      keyResult.teamId,
    )

    return {
      keyResult,
      cycle,
      team,
      parentCheckIn,
      teamMembers,
      author,
    }
  }

  private async getResolvedData(parentCheckIn: KeyResultCheckInInterface): Promise<ResolvedData> {
    const authorFullName = await this.core.dispatchCommand<string>(
      'get-user-full-name',
      this.activity.context.user,
    )

    const previousCheckInConfidenceColor = this.confidenceTagAdapter.getPrimaryColorFromConfidence(
      parentCheckIn?.confidence,
    )
    const previousCheckInConfidenceBackgroundColor = this.confidenceTagAdapter.getBackgroundColorFromConfidence(
      parentCheckIn?.confidence,
    )

    return {
      authorFullName,
      previousCheckInConfidenceColor,
      previousCheckInConfidenceBackgroundColor,
      checkIn: this.activity.data,
      author: this.activity.context.user,
      hasPreviousCheckIn: Boolean(parentCheckIn),
    }
  }

  private async dispatchBarrierEmail(): Promise<void> {
    const { data, metadata } = this.marshal()

    const customData = metadata.teamMembers.map((member) => ({
      recipientFirstName: member.firstName,
    }))
    const recipients = EmailNotificationChannel.buildRecipientsFromUsers(
      metadata.teamMembers,
      customData,
    )

    const emailMetadata: EmailNotificationChannelMetadata = {
      ...metadata,
      recipients,
      template: 'KeyResultWithBarrier',
    }
    const emailData = {
      isMaleTeam: data.team.gender === TeamGender.MALE,
      isFemaleTeam: data.team.gender === TeamGender.FEMALE,
      teamName: data.team.name,
      authorFirstName: data.author.firstName,
      isQuarterlyCadence: data.cycle.cadence === Cadence.QUARTERLY,
      cyclePeriod: data.cycle.period,
      authorPictureURL: data.author.picture,
      authorFullName: data.authorFullName,
      keyResultTitle: data.keyResult.title,
      keyResultPreviousConfidenceTagColorPrimary: data.previousCheckInConfidenceColor,
      keyResultPreviousConfidenceTagColorBackground: data.previousCheckInConfidenceBackgroundColor,
      keyResultComment: data.checkIn.comment,
      hasPreviousCheckIn: data.hasPreviousCheckIn,
      wasHighConfidence: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.high,
      wasMediumConfidence: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.medium,
      wasLowConfidence: data.parentCheckIn?.confidence === CONFIDENCE_TAG_THRESHOLDS.low,
      recipientFirstName: 'teste',
    }

    await this.channels.email.dispatch(emailData, emailMetadata)
  }
}