import { Injectable } from '@nestjs/common'

import {
  CreatedCheckInActivity,
  CREATED_CHECK_IN_ACTIVITY_TYPE,
} from '@adapters/activity/activities/created-check-in-activity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { ChannelHashmap } from '../types/channel-hashmap.type'
import { NotificationMetadata } from '../types/notification-metadata.type'

import { BaseNotification } from './base.notification'

type CreatedCheckInData = {
  team: TeamInterface
  author: UserInterface
  cycle: CycleInterface
  keyResult: KeyResultInterface
  parentCheckIn: KeyResultCheckInInterface
  checkIn: KeyResultCheckInInterface
}

type CreatedCheckInMetadata = {
  teamMembers: UserInterface[]
} & NotificationMetadata

type RelatedData = {
  team: TeamInterface
  author: UserInterface
  cycle: CycleInterface
  keyResult: KeyResultInterface
  parentCheckIn: KeyResultCheckInInterface
  teamMembers: UserInterface[]
}

@Injectable()
export class CreatedKeyResultCheckInNotification extends BaseNotification<
  CreatedCheckInData,
  CreatedCheckInMetadata,
  CreatedCheckInActivity
> {
  static activityType = CREATED_CHECK_IN_ACTIVITY_TYPE
  static notificationType = 'CreatedKeyResultCheckIn'

  constructor(activity: CreatedCheckInActivity, channels: ChannelHashmap, core: CorePortsProvider) {
    super(activity, channels, core, CreatedKeyResultCheckInNotification.notificationType)
  }

  public async prepare(): Promise<void> {
    const { team, cycle, keyResult, parentCheckIn, teamMembers } = await this.getRelatedData(
      this.activity.data,
    )

    const data = {
      team,
      cycle,
      keyResult,
      parentCheckIn,
      checkIn: this.activity.data,
      author: this.activity.context.user,
    }

    const metadata = {
      teamMembers,
    }

    this.data = data
    this.attachToMetadata(metadata)
  }

  public async dispatch(): Promise<void> {
    console.log('ok')
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
}
