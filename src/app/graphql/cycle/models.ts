import { ArgsType, Field, ID, ObjectType, InputType, registerEnumType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { EntityObject, StatusObject } from 'src/app/graphql/models'
import { ObjectiveObject, ObjectiveStatusObject } from 'src/app/graphql/objective/models'
import { TeamObject } from 'src/app/graphql/team/models'
import { DOMAIN_SORTING } from 'src/domain/constants'
import { CADENCE } from 'src/domain/cycle/constants'

registerEnumType(CADENCE, {
  name: 'CADENCE',
  description: 'Each cadence represents a period of time in which your cycles can be created',
})

@ObjectType('CycleStatus', {
  implements: () => StatusObject,
  description:
    "The current status of this cycle. By status we mean progress, confidence, and other reported values from it's objectives",
})
export class CycleStatusObject implements StatusObject {
  @Field(() => ObjectiveStatusObject, {
    description:
      'The most recent objective status update inside among all objectives for this cycle',
    nullable: true,
  })
  public latestObjectiveStatus?: ObjectiveStatusObject

  public progress: number
  public confidence: number
}

@ObjectType('Cycle', {
  implements: () => EntityObject,
  description:
    'The period of time that can contain multiple objectives. It is used to organize a team strategy',
})
export class CycleObject implements EntityObject {
  @Field({ description: 'The title of the cycle' })
  public title: string

  @Field(() => CADENCE, {
    description:
      'The candence of this cycle. Cadence is the frequency at which previous objectives have to be grade and new ones created.',
  })
  public cadence: CADENCE

  @Field({
    description: 'This flag defines if objectives related to this cycle can be updated',
  })
  public active: boolean

  @Field({ description: 'The date that this cycle starts' })
  public dateStart: Date

  @Field({ description: 'The date that this cycle ends' })
  public dateEnd: Date

  @Field(() => CycleStatusObject, {
    description:
      'The status of the given cycle. Here you can fetch the current progress, confidence, and others for that cycle',
  })
  public status: CycleStatusObject

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

  @Field(() => [KeyResultObject], {
    description: 'The key-results from this cycle',
    nullable: true,
  })
  public keyResults?: KeyResultObject[]

  @Field(() => ID, {
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, the ID of that will be recorded here',
  })
  public parentId?: CycleObject['id']

  @Field(() => CycleObject, {
    nullable: true,
    description:
      'Each cycle can relates with a given higher cycle, creating a for of tree-like architecture. If this cycle has any cycle above it, that one will be recorded here',
  })
  public parent?: CycleObject

  @Field(() => [CycleObject], {
    nullable: true,
    description:
      'Each cycle can have multiple cycles below it. If this cycle has any cycle inside of it, those will be listed here',
  })
  public cycles?: CycleObject[]

  public id: string
  public policies: PolicyObject
}

@InputType({
  description: 'In this object the user can define a custom ordering',
})
export class CycleOrderByInput {
  @Field(() => DOMAIN_SORTING, {
    description:
      'This key defines how our cycles should be ordered based on their cadence key. Desc sorting means higher cadences first (year-quarter-month-...)',
    nullable: true,
  })
  public cadence?: DOMAIN_SORTING
}

@ArgsType()
export class CycleQueryArguments {
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

  @Field(() => CycleOrderByInput, {
    defaultValue: {
      cadence: DOMAIN_SORTING.DESC,
    },
  })
  public orderBy?: CycleOrderByInput
}

@ArgsType()
export class CycleSameTitleQueryArguments extends CycleQueryArguments {
  @Field(() => [ID], {
    description: 'Defines the parent cycles we are going to fetch children from',
  })
  public parentIds: Array<CycleObject['id']>
}
