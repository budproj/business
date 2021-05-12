import { Injectable, Logger, Scope } from '@nestjs/common'

import { Activity } from '@adapters/activity/activities/base.activity'
import { ActivityDispatcher } from '@adapters/activity/interfaces/activity-dispatcher.interface'

@Injectable({ scope: Scope.REQUEST })
export class NotificationProvider implements ActivityDispatcher {
  private readonly logger = new Logger(NotificationProvider.name)

  public async dispatch<D = any>(activity: Activity<D>): Promise<void> {
    console.log(activity)
  }
}
