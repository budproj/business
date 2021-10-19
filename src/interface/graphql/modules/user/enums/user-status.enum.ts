import { registerEnumType } from '@nestjs/graphql/dist'

import { UserStatus } from '@core/modules/user/enums/user-status.enum'

export const UserStatusGraphQLEnum = UserStatus

registerEnumType(UserStatusGraphQLEnum, {
  name: 'UserStatus',
  description: 'Each status represents a status for our users',
})
