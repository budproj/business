import { Field, ID, ObjectType } from '@nestjs/graphql'

import { TeamObject } from 'src/app/graphql/team/models'

@ObjectType('Cycle', {
  description:
    'The period of time that can contain multiple objectives. It is used to organize a team strategy',
})
export class CycleObject {
  @Field(() => ID, { description: 'The ID of the cycle' })
  id: string

  @Field({ description: 'The date that this cycle starts' })
  dateStart: Date

  @Field({ description: 'The date that this cycle ends' })
  dateEnd: Date

  @Field({ description: 'The creation date of this cycle' })
  createdAt: Date

  @Field({ description: 'The last update date of this cycle' })
  updatedAt: Date

  @Field(() => ID, { description: 'The team ID that this cycle belongs to' })
  teamId: TeamObject['id']

  @Field(() => TeamObject, { description: 'The team that this cycle belongs to' })
  team: TeamObject

  // @Field(() => [ObjectiveObject], { description: 'The objectives inside this cycle' })
  // objectives: ObjectiveObject[]

  @Field({ description: 'The name of the cycle' })
  name?: string
}
