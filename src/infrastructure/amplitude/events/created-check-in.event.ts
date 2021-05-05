import { Injectable } from '@nestjs/common'

import { CreatedCheckInActivity } from '@adapters/activity/activities/created-check-in.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { BaseAmplitudeEvent } from './base.event'

const EVENT_TYPE = 'CreatedCheckIn'
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
export class CreatedCheckInAmplitudeEvent extends BaseAmplitudeEvent<CreatedCheckInAmplitudeEventProperties> {
  static activityName = EVENT_TYPE

  constructor(
    protected readonly activity: CreatedCheckInActivity,
    protected readonly core: CorePortsProvider,
  ) {
    super({
      activity: CreatedCheckInAmplitudeEvent.activityName,
      ...activity.metadata,
    })
  }

  public async loadProperties(): Promise<void> {}
}
