import { registerEnumType } from '@nestjs/graphql/dist'

import { UserGender } from '@core/modules/user/enums/user-gender.enum'

export const UserGenderGraphQLEnum = UserGender

registerEnumType(UserGenderGraphQLEnum, {
  name: 'UserGender',
  description: 'Each gender represents a possible gender option for our users',
})
