import { registerEnumType } from '@nestjs/graphql/dist'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'

export const TeamGenderGraphQLEnum = TeamGender

registerEnumType(TeamGenderGraphQLEnum, {
  name: 'TeamGender',
  description: 'Each gender represents a possible gender option for our teams',
})
