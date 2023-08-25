import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'

import { Command } from './base.command'

export class UpdateUserMainTeamInPreferencesCommand extends Command<UserSetting> {
  public async execute(userId: string, mainTeamId: string): Promise<UserSetting> {
    const currentSetting = await this.core.user.setting.getOne({ userId })
    const setting = await this.core.user.setting.update(
      { id: currentSetting.id },
      { preferences: { ...currentSetting.preferences, main_team: mainTeamId } },
    )

    return setting
  }
}
