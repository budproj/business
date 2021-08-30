import { Activity } from '@adapters/activity/activities/base.activity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { Notification } from '@infrastructure/notification/interfaces/notification.interface'
import { ChannelHashmap } from '@infrastructure/notification/types/channel-hashmap.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'

export abstract class BaseNotification<
  D extends NotificationData,
  M extends NotificationMetadata = NotificationMetadata,
  A extends Activity = Activity,
> {
  static activityType: string
  static notificationType: string

  protected metadata!: M
  protected data?: D

  protected constructor(
    protected readonly activity: A,
    protected readonly channels: ChannelHashmap,
    protected readonly core: CorePortsProvider,
    notificationType: string,
  ) {
    this.metadata = this.marshalMetadata(activity, notificationType)
  }

  public marshal(): Notification<D, M> {
    return {
      metadata: this.metadata,
      data: this.data,
    }
  }

  protected attachToMetadata(newMetadata: Partial<M>): void {
    this.metadata = {
      ...this.metadata,
      ...newMetadata,
    }
  }

  private marshalMetadata(activity: A, notificationType: string): M {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return {
      ...activity.metadata,
      notificationType,
    } as M
  }

  public abstract prepare(): Promise<void>

  public abstract dispatch(): Promise<void>
}
