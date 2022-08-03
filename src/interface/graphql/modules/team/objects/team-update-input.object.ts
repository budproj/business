import { InputType, Field, ID } from '@nestjs/graphql'

import { TeamGender } from '@core/modules/team/enums/team-gender.enum'

import { TeamGenderGraphQLEnum } from '../enums/team-gender.enum'

@InputType('TeamUpdateInput', {
  description: 'Data that you need to provide while updating a new team',
})
export class TeamUpdateInputObject {
  @Field(() => String, { description: 'The name of the team', nullable: true })
  name?: string

  @Field(() => String, { description: 'The description of the team', nullable: true })
  description?: string

  @Field(() => TeamGenderGraphQLEnum, {
    description: 'The description of the team',
    nullable: true,
  })
  gender?: TeamGender

  @Field(() => ID, { description: 'The user id of the team owner', nullable: true })
  ownerId?: string

  @Field(() => ID, { description: 'The id of the parent team', nullable: true })
  parentId?: string
}
