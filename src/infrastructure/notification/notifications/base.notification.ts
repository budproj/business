import { Activity } from '@adapters/activity/activities/base.activity'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { EmailNotificationChannel } from '@infrastructure/notification/channels/email/email.channel'
import { Notification } from '@infrastructure/notification/interfaces/notification.interface'
import { ChannelHashmap } from '@infrastructure/notification/types/channel-hashmap.type'
import { NotificationData } from '@infrastructure/notification/types/notification-data.type'
import { NotificationMetadata } from '@infrastructure/notification/types/notification-metadata.type'
import { NotificationRecipient } from '@infrastructure/notification/types/recipient.type'

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

  protected async buildRecipients(
    recipients: UserInterface[],
    originalCustomData?: Array<Record<string, any>>,
  ): Promise<NotificationRecipient[]> {
    const usersLocale = await this.getLocaleFromUsers(recipients)
    const customData = usersLocale.map((locale, index) => ({
      locale,
      ...originalCustomData?.[index],
    }))

    return EmailNotificationChannel.buildRecipientsFromUsers(recipients, customData)
  }

  private async getLocaleFromUsers(users: UserInterface[]): Promise<string[]> {
    const settingsPromises = users.map(async (user) =>
      this.core.dispatchCommand<UserSetting[]>('get-user-settings', user.id, ['LOCALE']),
    )
    const settings = await Promise.all(settingsPromises)

    return settings.map((setting) => setting[0]?.value)
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
