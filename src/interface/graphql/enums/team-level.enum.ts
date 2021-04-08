import { registerEnumType } from '@nestjs/graphql/dist'

export enum TeamLevelGraphQLEnum {
  COMPANY = 'company',
  COMPANY_OR_DEPARTMENT = 'company-or-department',
}

registerEnumType(TeamLevelGraphQLEnum, {
  name: 'TeamType',
  description: 'Define the level of the team in the hierarchy',
})
