import { registerEnumType } from '@nestjs/graphql'

import { USER_GENDER } from 'src/domain/user/constants'

export const UserGenderGraphQLEnum = USER_GENDER

registerEnumType(UserGenderGraphQLEnum, {
  name: 'UserGender',
  description: 'Each gender represents a possible gender option for our users',
})
