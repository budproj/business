import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'

import { Command } from './base.command'

export class UpdateUserSettingCommand extends Command<UserSetting> {
  public async execute(userId: string, key: Key, value: string): Promise<UserSetting> {
    const currentSetting = await this.core.user.setting.getOne({ userId, key })

    return currentSetting
      ? this.core.user.setting.update({ id: currentSetting.id }, { value })
      : this.core.user.setting.createOne({
          key,
          value,
          userId,
        })
  }
}
