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
      if (setting.key === Key.LOCALE) {
        await this.core.user.updateUserProperty(setting.userId, setting.key, setting.value)
      }

      return keys ? GetUserSettingsCommand.reduceToKeys([setting], keys) : filter(userSettings)
    }

    return keys ? GetUserSettingsCommand.reduceToKeys(userSettings, keys) : filter(userSettings)
  }
}
