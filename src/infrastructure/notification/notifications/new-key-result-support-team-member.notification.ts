import { Injectable } from '@nestjs/common'

import {
  NewKeyResultSupportTeamMemberActivity,
  NEW_KEY_RESULT_SUPPORT_TEAM_MEMBER_ACTIVITY_TYPE,
} from '@adapters/activity/activities/new-key-result-support-team-member.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'

import { ChannelHashmap } from '../types/channel-hashmap.type'
import { NotificationMetadata } from '../types/notification-metadata.type'

import { BaseNotification } from './base.notification'

type Data = RelatedData & ResolvedData

type Metadata = Record<string, unknown> & NotificationMetadata

type RelatedData = Record<string, unknown>

type ResolvedData = Record<string, unknown>

@Injectable()
export class NewKeyResultSupportTeamMemberNotification extends BaseNotification<
  Data,
  Metadata,
  NewKeyResultSupportTeamMemberActivity
> {
  static activityType = NEW_KEY_RESULT_SUPPORT_TEAM_MEMBER_ACTIVITY_TYPE
  static notificationType = 'NewKeyResultSupportTeamMember'

  constructor(
    activity: NewKeyResultSupportTeamMemberActivity,
    channels: ChannelHashmap,
    core: CorePortsProvider,
  ) {
    super(activity, channels, core, NewKeyResultSupportTeamMemberNotification.notificationType)
  }

  public async prepare(): Promise<void> {
    const data = {}

    const metadata = {}

    this.data = data
    this.attachToMetadata(metadata)
  }

  public async dispatch(): Promise<void> {
    const { data } = this.marshal()

    console.log(data)
  }
}
