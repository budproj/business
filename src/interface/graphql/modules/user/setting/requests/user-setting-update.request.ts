import { ArgsType, Field, ID } from '@nestjs/graphql'

import { Key } from '@core/modules/user/setting/user-setting.enums'
import { UserSettingKeyGraphQLEnum } from '@interface/graphql/modules/user/setting/user-setting.enums'

@ArgsType()
export class UserSettingUpdateRequest {
  @Field(() => ID, {
    description: 'The ID of the user you are updating settings',
  })
  public userID: string

  @Field(() => UserSettingKeyGraphQLEnum, {
    description: 'A specific key you want to change user settings',
  })
  public key: Key

  @Field(() => String, {
    description: 'The value of the new setting',
  })
  public value: string
}
