import { filter } from 'lodash'

import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'

import { Command } from './base.command'

export class GetUserSettingsCommand extends Command<UserSetting[]> {
  static reduceToKeys(settings: UserSetting[], keys: Key[]): UserSetting[] {
    return filter(settings.filter((setting) => keys.includes(setting.key)))
  }

  public async execute(userID: string, keys?: Key[]): Promise<UserSetting[]> {
    const userSettings = await this.core.user.setting.getFromUser(userID)
    if (userSettings.length <= 0) {
      const setting = await this.core.user.setting.createOne({
        key: Key.LOCALE,
        value: 'pt-BR',
        userId: userID,
      })
      await this.propagateNewSetting(setting)
      return keys ? GetUserSettingsCommand.reduceToKeys([setting], keys) : filter(userSettings)
    }

    return keys ? GetUserSettingsCommand.reduceToKeys(userSettings, keys) : filter(userSettings)
  }

  private async propagateNewSetting(setting: UserSetting): Promise<void> {
    if (setting.key === Key.LOCALE) await this.propagateLocale(setting)
  }

  private async propagateLocale(setting: UserSetting): Promise<void> {
    return this.core.user.updateUserProperty(setting.userId, setting.key, setting.value)
  }
}
