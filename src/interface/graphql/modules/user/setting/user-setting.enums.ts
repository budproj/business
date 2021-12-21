import { registerEnumType } from '@nestjs/graphql/dist'

import { Key } from '@core/modules/user/setting/user-setting.enums'

export const UserSettingKeyGraphQLEnum = Key

registerEnumType(UserSettingKeyGraphQLEnum, {
  name: 'UserSettingKey',
  description: 'The key of a given setting for a user',
})
