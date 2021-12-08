import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'

import { Command } from './base.command'

export class GetUserSettingsCommand extends Command<UserSetting[]> {
  static reduceToKeys(settings: UserSetting[], keys: Key[]): UserSetting[] {
    return settings.filter((setting) => keys.includes(setting.key))
  }

  public async execute(userID: string, keys?: Key[]): Promise<UserSetting[]> {
    const userSettings = await this.core.user.setting.getFromUser(userID)

    return keys ? GetUserSettingsCommand.reduceToKeys(userSettings, keys) : userSettings
  }
}
