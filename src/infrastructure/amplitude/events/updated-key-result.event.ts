import { Injectable } from '@nestjs/common'

import {
  UPDATED_KEY_RESULT_ACTIVITY_TYPE,
  UpdatedKeyResultActivity,
} from '@adapters/activity/activities/updated-key-result-activity'
import { Team } from '@core/modules/team/team.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { BaseAmplitudeEvent } from './base.event'

type UpdatedKeyResultAmplitudeEventProperties = {
  isOwner?: boolean
  titleChanged?: boolean
  descriptionChanged?: boolean
  initialValueChanged?: boolean
  goalChanged?: boolean
  ownerChanged?: boolean
  company?: string
  team?: string
}

type RelatedData = {
  team: Team
  company: Team
}

@Injectable()
export class UpdatedKeyResultAmplitudeEvent extends BaseAmplitudeEvent<
  UpdatedKeyResultAmplitudeEventProperties,
  UpdatedKeyResultActivity
> {
  static activityType = UPDATED_KEY_RESULT_ACTIVITY_TYPE
  static amplitudeEventType = 'UpdatedKeyResult'

  constructor(activity: UpdatedKeyResultActivity, protected readonly core: CorePortsProvider) {
    super(activity, UpdatedKeyResultAmplitudeEvent.amplitudeEventType)
  }

  public async prepare(): Promise<void> {
    const { team, company } = await this.getRelatedData()

    this.properties = {
      isOwner: this.isOwner(),
      titleChanged: this.titleChanged(),
      descriptionChanged: this.descriptionChanged(),
      initialValueChanged: this.initialValueChanged(),
      goalChanged: this.goalChanged(),
      ownerChanged: this.ownerChanged(),
      team: team.name,
      company: company.name,
    }
  }

  private async getRelatedData(): Promise<RelatedData> {
    const team = await this.getTeam()
    const company = await this.getCompany(team)

    return {
      team,
      company,
    }
  }

  private isOwner(): boolean {
    return this.activity.data.ownerId === this.activity.context.user.id
  }

  private titleChanged(): boolean {
    return this.activity.context.originalKeyResult.title !== this.activity.data.title
  }

  private descriptionChanged(): boolean {
    return this.activity.context.originalKeyResult.description !== this.activity.data.description
  }

  private initialValueChanged(): boolean {
    return this.activity.context.originalKeyResult.initialValue !== this.activity.data.initialValue
  }

  private goalChanged(): boolean {
    return this.activity.context.originalKeyResult.goal !== this.activity.data.goal
  }

  private ownerChanged(): boolean {
    return this.activity.context.originalKeyResult.ownerId !== this.activity.data.ownerId
  }

  private async getTeam(): Promise<Team> {
    return this.core.dispatchCommand<Team>('get-key-result-team', this.activity.data)
  }

  private async getCompany(team: Team): Promise<Team> {
    return this.core.dispatchCommand<Team>('get-team-company', team)
  }
}
