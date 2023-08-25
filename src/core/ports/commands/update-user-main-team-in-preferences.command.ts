import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'

import { Command } from './base.command'

export class UpdateUserMainTeamInPreferencesCommand extends Command<UserSetting> {
  public async execute(userId: string, mainTeamId: string): Promise<UserSetting> {
    const currentSetting = await this.core.user.setting.getOne({ userId })
    const setting = currentSetting
      ? await this.core.user.setting.update(
          { id: currentSetting.id },
          { preferences: { ...currentSetting.preferences, main_team: mainTeamId } },
        )
      : await this.core.user.setting.createOne({
          key: Key.LOCALE,
          value: 'pt-BR',
          userId,
          preferences: { main_team: mainTeamId },
        })

    await this.propagateNewSetting(setting)

    return setting
  }

  private async propagateNewSetting(setting: UserSetting): Promise<void> {
    if (setting.key === Key.LOCALE) await this.propagateLocale(setting)
  }

  private async propagateLocale(setting: UserSetting): Promise<void> {
    return this.core.user.updateUserProperty(setting.userId, setting.key, setting.value)
  }
}
