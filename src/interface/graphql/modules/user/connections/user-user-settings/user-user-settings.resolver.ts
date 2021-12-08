import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { UserSettingInterface } from '@core/modules/user/setting/user-setting.interface'
import { UserSetting } from '@core/modules/user/setting/user-settings.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'

import { UserSettingsGraphQLConnection } from './user-user-settings.connection'

@GuardedResolver(UserSettingsGraphQLConnection)
export class UserUserSettingsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  UserSetting,
  UserSettingInterface
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.USER_SETTING, core, core.user.setting)
  }
}
