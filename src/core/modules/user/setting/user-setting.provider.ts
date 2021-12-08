import { Injectable } from '@nestjs/common'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { UserSettingInterface } from '@core/modules/user/setting/user-setting.interface'
import { UserSettingRepository } from '@core/modules/user/setting/user-setting.repository'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'
import { CreationQuery } from '@core/types/creation-query.type'

@Injectable()
export class UserSettingProvider extends CoreEntityProvider<UserSetting, UserSettingInterface> {
  constructor(protected readonly repository: UserSettingRepository) {
    super(UserSettingProvider.name, repository)
  }

  public async getFromUser(userId: string): Promise<UserSetting[]> {
    return this.repository.find({
      userId,
    })
  }

  protected async protectCreationQuery(
    _query: CreationQuery<UserSetting>,
    _data: Partial<UserSettingInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
