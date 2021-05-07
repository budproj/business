import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE } from '@adapters/activity/activities/created-key-result-comment.activity'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { Cadence } from '@core/modules/cycle/enums/cadence.enum'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { BaseAmplitudeEvent } from './base.event'

type CreatedKeyResultCommentAmplitudeEventProperties = {
  isSameTeam?: boolean
  team?: string
  company?: string
  cycleCadence?: Cadence
  length?: number
}

type RelatedData = {
  keyResult: KeyResult
  cycle: Cycle
  team: Team
  company: Team
}

@Injectable()
export class CreatedKeyResultCommentAmplitudeEvent extends BaseAmplitudeEvent<
  CreatedKeyResultCommentAmplitudeEventProperties,
  KeyResultComment
> {
  static activityType = CREATED_KEY_RESULT_COMMENT_ACTIVITY_TYPE
  static amplitudeEventType = 'CreatedKeyResultComment'

  constructor(activity: Activity<KeyResultComment>, protected readonly core: CorePortsProvider) {
    super(activity, CreatedKeyResultCommentAmplitudeEvent.amplitudeEventType)
  }

  public async loadProperties(): Promise<void> {
    const { team, cycle, company } = await this.getRelatedData()

    this.properties = {
      isSameTeam: this.isSameTeam(team),
      cycleCadence: cycle.cadence,
      length: this.getCommentLength(),
      team: team.name,
      company: company.name,
    }
  }

  private async getRelatedData(): Promise<RelatedData> {
    const keyResult = await this.getKeyResult()
    const cycle = await this.getCycle(keyResult)
    const team = await this.getTeam()
    const company = await this.getCompany(team)

    return {
      keyResult,
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

  private async getCycle(keyResult: KeyResult): Promise<Cycle> {
    return this.core.dispatchCommand<Cycle>('get-key-result-cycle', keyResult)
  }

  private async getTeam(): Promise<Team> {
    return this.core.dispatchCommand<Team>('get-key-result-comment-team', this.activity.data)
  }

  private async getCompany(team: Team): Promise<Team> {
    return this.core.dispatchCommand<Team>('get-team-company', team)
  }

  private isSameTeam(keyResultTeam: Team): boolean {
    return this.activity.context.user.teams.some((userTeam) => userTeam.id === keyResultTeam.id)
  }

  private getCommentLength(): number {
    return this.activity.data.text.length
  }
}
