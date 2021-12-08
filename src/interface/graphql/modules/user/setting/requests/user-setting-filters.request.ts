import { ArgsType, Field } from '@nestjs/graphql'

import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSettingKeyGraphQLEnum } from '@interface/graphql/modules/user/setting/user-setting.enums'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class UserSettingFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => [UserSettingKeyGraphQLEnum], {
    nullable: true,
    description: 'A specific key you want to query from user settings',
  })
  public keys?: Key[]
}
