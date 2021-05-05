import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CREATED_CHECK_IN_ACTIVITY_TYPE } from '@adapters/activity/activities/created-check-in-activity'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { BaseAmplitudeEvent } from './base.event'

type CreatedCheckInAmplitudeEventProperties = {
  isOwner?: boolean
  userRole?: 'SQUAD MEMBER' | 'LEADER' | 'TEAM MEMBER'
  keyResultType?: 'NUMBER' | 'PERCENTAGE' | 'COIN_BRL' | 'COIN_USD'
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

  public async loadProperties(): Promise<void> {}
}
