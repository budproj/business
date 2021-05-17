import { Injectable } from '@nestjs/common'

import {
  CREATED_CHECK_IN_ACTIVITY_TYPE,
  CreatedCheckInActivity,
} from '@adapters/activity/activities/created-check-in-activity'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { BaseAmplitudeEvent } from './base.event'

type CreatedCheckInAmplitudeEventProperties = {
  isOwner?: boolean
  keyResultFormat?: 'NUMBER' | 'PERCENTAGE' | 'COIN_BRL' | 'COIN_USD'
  isFirst?: boolean
  minutesSinceLastCheckIn?: number
  cycleCadence?: 'QUARTERLY' | 'YEARLY'
  deltaProgress?: number
  progressChanged?: boolean
  deltaConfidenceTag?: number
  confidenceChanged?: boolean
  hasComment?: boolean
  commentLength?: number
  company?: string
  team?: string
}

type RelatedData = {
  keyResult: KeyResult
  keyResultCheckInList: KeyResultCheckIn[]
  cycle: Cycle
  team: Team
  company: Team
}

@Injectable()
export class CreatedCheckInAmplitudeEvent extends BaseAmplitudeEvent<
  CreatedCheckInAmplitudeEventProperties,
  CreatedCheckInActivity
> {
  static activityType = CREATED_CHECK_IN_ACTIVITY_TYPE
  static amplitudeEventType = 'CreatedCheckIn'

  constructor(activity: CreatedCheckInActivity, protected readonly core: CorePortsProvider) {
    super(activity, CreatedCheckInAmplitudeEvent.amplitudeEventType)
  }

  public async prepare(): Promise<void> {
    const { keyResult, keyResultCheckInList, cycle, team, company } = await this.getRelatedData()

    const deltaProgress = await this.getDeltaProgress()
    const deltaConfidenceTag = await this.getDeltaConfidenceTag()
    const commentLength = this.getCommentLength()

    this.properties = {
      deltaProgress,
      deltaConfidenceTag,
      commentLength,
      isOwner: this.isUserOwner(keyResult),
      keyResultFormat: keyResult.format,
      isFirst: this.isFirst(keyResultCheckInList),
      minutesSinceLastCheckIn: await this.getMinutesSinceLastCheckIn(),
      cycleCadence: cycle.cadence,
      progressChanged: Boolean(deltaProgress),
      confidenceChanged: Boolean(deltaConfidenceTag),
      hasComment: Boolean(commentLength),
      team: team.name,
      company: company.name,
    }
  }

  private async getRelatedData(): Promise<RelatedData> {
    const keyResult = await this.getKeyResult()
    const keyResultCheckInList = await this.getKeyResultCheckInList(keyResult)
    const cycle = await this.getCycle(keyResult)
    const team = await this.getTeam()
    const company = await this.getCompany(team)

    return {
      keyResult,
      keyResultCheckInList,
      cycle,
      team,
      company,
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

  private async getCycle(keyResult: KeyResult): Promise<Cycle> {
    return this.core.dispatchCommand<Cycle>('get-key-result-cycle', keyResult)
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
    return this.core.dispatchCommand<number>(
      'get-key-result-check-in-window-for-check-in',
      this.activity.data,
    )
  }

  private async getDeltaProgress(): Promise<number> {
    return this.core.dispatchCommand<number>(
      'get-key-result-check-in-delta',
      this.activity.data,
      'progress',
    )
  }

  private async getDeltaConfidenceTag(): Promise<number> {
    return this.core.dispatchCommand<number>(
      'get-key-result-check-in-delta',
      this.activity.data,
      'confidenceTag',
    )
  }

  private getCommentLength(): number {
    return this.activity.data.comment?.length
  }

  private async getTeam(): Promise<Team> {
    return this.core.dispatchCommand<Team>('get-key-result-check-in-team', this.activity.data)
  }

  private async getCompany(team: Team): Promise<Team> {
    return this.core.dispatchCommand<Team>('get-team-company', team)
  }
}
