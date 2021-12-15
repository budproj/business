import { InputType, Field, ID } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'

import { TeamGenderGraphQLEnum } from '../enums/team-gender.enum'

@InputType('TeamCreateInput', {
  description: 'Data that you need to provide while creating a new user',
})
export class TeamCreateInputObject {
  @Field(() => String, { description: 'The name of the team' })
  public readonly name: string

  @Field(() => String, { description: 'The description of the team' })
  public readonly description: string

  @Field(() => TeamGenderGraphQLEnum, { description: 'The description of the team' })
  gender?: TeamGender

  @Field(() => ID, { description: 'The user id of the team owner' })
  ownerID: string

  @Field(() => ID, { description: 'The id of the parent team' })
  parentID?: string
}
