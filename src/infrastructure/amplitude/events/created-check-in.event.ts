import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CREATED_CHECK_IN_ACTIVITY_TYPE } from '@adapters/activity/activities/created-check-in-activity'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { BaseAmplitudeEvent } from './base.event'

type CreatedCheckInAmplitudeEventProperties = {
  isOwner?: boolean
  keyResultFormat?: 'NUMBER' | 'PERCENTAGE' | 'COIN_BRL' | 'COIN_USD'
  isFirst?: boolean
  minutesSinceLastCheckIn?: number
  keyResultCycleCadence?: 'QUARTERLY' | 'YEARLY'
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

type RelatedData = {
  keyResult: KeyResult
  keyResultCheckInList: KeyResultCheckIn[]
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
    const { keyResult, keyResultCheckInList } = await this.getRelatedData()

    this.properties = {
      isOwner: this.isUserOwner(keyResult),
      keyResultFormat: keyResult.format,
      isFirst: this.isFirst(keyResultCheckInList),
      minutesSinceLastCheckIn: await this.getMinutesSinceLastCheckIn(),
    }
  }

  private async getRelatedData(): Promise<RelatedData> {
    const keyResult = await this.getKeyResult()
    const keyResultCheckInList = await this.getKeyResultCheckInList(keyResult)

    return {
      keyResult,
      keyResultCheckInList,
    }
  }

  private async getKeyResult(): Promise<KeyResult> {
    return this.core.dispatchCommand<KeyResult>('get-key-result', {
      id: this.activity.data.keyResultId,
    })
  }

  private async getKeyResultCheckInList(keyResult: KeyResult): Promise<KeyResultCheckIn[]> {
    return this.core.dispatchCommand<KeyResultCheckIn[]>('get-key-result-check-in-list', keyResult)
  }

  private isUserOwner(keyResult: KeyResult): boolean {
    return keyResult.ownerId === this.activity.context.user.id
  }

  private isFirst(keyResultCheckIns: KeyResultCheckIn[]): boolean {
    if (!keyResultCheckIns || keyResultCheckIns.length === 0) return false
    const firstCheckIn = keyResultCheckIns[0]

    return firstCheckIn.id === this.activity.data.id
  }

  private async getMinutesSinceLastCheckIn(): Promise<number> {
    return this.core.dispatchCommand<number>('get-check-in-window-for-check-in', this.activity.data)
  }
}
