import { ArgsType, Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { EntityObject } from 'src/app/graphql/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import { TeamObject } from 'src/app/graphql/team/models'
import { CADENCE } from 'src/domain/cycle/constants'

registerEnumType(CADENCE, {
  name: 'CADENCE',
  description: 'Each cadence represents a period of time in which your cycles can be created',
})

@ObjectType('Cycle', {
  implements: () => EntityObject,
  description:
    'The period of time that can contain multiple objectives. It is used to organize a team strategy',
})
export class CycleObject implements EntityObject {
  @Field({ description: 'The title of the cycle' })
  public title: string

  @Field(() => CADENCE, { description: 'The candence of this cycle' })
  public cadence: CADENCE

  @Field({
    description: 'This flag defines if objectives related to this cycle can still be updated',
  })
  public active: boolean

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

  @Field(() => [ObjectiveObject], {
    description: 'The objectives inside this cycle',
    nullable: true,
  })
  public objectives?: ObjectiveObject[]

  public id: string
  public policies: PolicyObject
}

@ArgsType()
export class CycleFiltersArguments {
  @Field(() => Boolean, {
    description: 'If this flag is true, it will only fetch active cycles',
    defaultValue: true,
  })
  public active: boolean

  @Field(() => CADENCE, {
    description: 'This key filters all queries to a given cadence',
    nullable: true,
  })
  public cadence?: CADENCE
}
