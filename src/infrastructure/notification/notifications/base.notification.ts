import { Activity } from '@adapters/activity/activities/base.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'
import { Notification } from '@infrastructure/notification/types/notification.type'

export abstract class BaseNotification<D extends NotificationData, A extends Activity = Activity> {
  static activityType: string
  static notificationType: string

  protected core!: CorePortsProvider
  protected readonly metadata!: NotificationMetadata
  protected data?: D

  protected constructor(protected readonly activity: A, notificationType: string) {
    this.metadata = this.marshalMetadata(activity, notificationType)
  }

  public marshal(): Notification {
    return {
      metadata: this.metadata,
      data: this.data,
    }
  }

  private marshalMetadata(activity: A, notificationType: string): NotificationMetadata {
    return {
      ...activity.metadata,
      notificationType,
    }
  }

  public abstract loadData(): Promise<void>
}
