import { Injectable } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { UPDATED_KEY_RESULT_ACTIVITY_TYPE } from '@adapters/activity/activities/updated-key-result-activity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
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
  KeyResult
> {
  static activityType = UPDATED_KEY_RESULT_ACTIVITY_TYPE
  static amplitudeEventType = 'UpdatedKeyResult'

  constructor(activity: Activity<KeyResult>, protected readonly core: CorePortsProvider) {
    super(activity, UpdatedKeyResultAmplitudeEvent.amplitudeEventType)
  }

  public async loadProperties(): Promise<void> {
    this.properties = {
      isOwner: this.isOwner(),
    }
  }

  private isOwner(): boolean {
    return this.activity.data.ownerId === this.activity.context.user.id
  }
}
