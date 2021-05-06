import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CREATED_CHECK_IN_ACTIVITY_TYPE } from '@adapters/activity/activities/created-check-in-activity'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { BaseAmplitudeEvent } from './base.event'

type CreatedCheckInAmplitudeEventProperties = {
  isOwner?: boolean
  userRole?: 'SQUAD MEMBER' | 'LEADER' | 'TEAM MEMBER'
  keyResultFormat?: 'NUMBER' | 'PERCENTAGE' | 'COIN_BRL' | 'COIN_USD'
  isFirst?: boolean
  lastCheckIn?: string
  timeSinceLast?: string
  keyResultCyclePeriod?: string
  progressChanged?: boolean
  previousProgress?: number
  newProgress?: number
  deltaProgress?: number
  confidenceChanged?: boolean
  oldConfidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'BARRIER'
  newConfidence?: 'HIGH' | 'MEDIUM' | 'LOW' | 'BARRIER'
  hasComment?: boolean
  commentLength?: number
}

@Injectable()
export class CreatedCheckInAmplitudeEvent extends BaseAmplitudeEvent<
  CreatedCheckInAmplitudeEventProperties,
  KeyResultCheckIn
> {
  static activityType = CREATED_CHECK_IN_ACTIVITY_TYPE
  static amplitudeEventType = 'CreatedCheckIn'

  constructor(activity: Activity<KeyResultCheckIn>, protected readonly core: CorePortsProvider) {
    super(activity, CreatedCheckInAmplitudeEvent.amplitudeEventType)
  }

  public async loadProperties(): Promise<void> {
    const keyResult = await this.core.dispatchCommand<KeyResult>('get-key-result', {
      id: this.activity.data.keyResultId,
    })

    this.properties = {
      isOwner: this.isUserOwner(keyResult),
      keyResultFormat: keyResult.format,
      isFirst: await this.isFirst(keyResult),
    }
  }

  private isUserOwner(keyResult: KeyResult): boolean {
    return keyResult.ownerId === this.activity.context.user.id
  }

  private async isFirst(keyResult: KeyResult): Promise<boolean> {
    const keyResultCheckIns = await this.core.dispatchCommand<KeyResultCheckIn[]>(
      'get-key-result-check-in-list',
      keyResult,
    )
    if (!keyResultCheckIns || keyResultCheckIns.length === 0) return false

    const firstCheckIn = keyResultCheckIns.slice(-1)[0]

    return firstCheckIn.id === this.activity.data.id
  }
}
