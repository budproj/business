import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ObjectiveObject } from 'src/app/graphql/objective/models'
import { TeamObject } from 'src/app/graphql/team/models'

@ObjectType('Cycle', {
  description:
    'The period of time that can contain multiple objectives. It is used to organize a team strategy',
})
export class CycleObject {
  @Field(() => ID, { description: 'The ID of the cycle' })
  public id: string

  @Field({ description: 'The date that this cycle starts' })
  public dateStart: Date

  @Field({ description: 'The date that this cycle ends' })
  public dateEnd: Date

  @Field({ description: 'The creation date of this cycle' })
  public createdAt: Date

  @Field({ description: 'The last update date of this cycle' })
  public updatedAt: Date

  @Field(() => ID, { description: 'The team ID that this cycle belongs to' })
  public teamId: TeamObject['id']

  @Field(() => TeamObject, { description: 'The team that this cycle belongs to' })
  public team: TeamObject

  @Field({ description: 'The name of the cycle' })
  public name?: string

  @Field(() => [ObjectiveObject], {
    description: 'The objectives inside this cycle',
    nullable: true,
  })
  public objectives?: ObjectiveObject[]
}
