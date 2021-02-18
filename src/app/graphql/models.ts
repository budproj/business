import { Field, Float, ID, InputType, Int, InterfaceType, registerEnumType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
import { CycleObject } from 'src/app/graphql/cycle/models'
import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'

registerEnumType(DOMAIN_QUERY_ORDER, {
  name: 'QUERY_ORDER',
  description: 'Defines the order to return your results in a given query',
})

@InterfaceType()
export abstract class EntityObject {
  @Field(() => ID, { description: 'The ID of this entity' })
  public id: string

  @Field(() => PolicyObject, {
    description:
      'Group of policies regarding the given entity. Those policies decribe actions that your user can perform with that given resource',
  })
  public policies: PolicyObject
}

@InterfaceType()
export abstract class DeleteResultObject {
  @Field(() => Int, { description: 'The amount of entities removed' })
  public affected: number
}

@InterfaceType('Status', {
  description:
    "The current status of an entity. By status we mean progress, confidence, and other reported values from it's children",
})
export class StatusObject {
  @Field(() => Float, {
    description:
      'The computed percentage current progress of this entity. The entity progress calculation vary based on the entity',
  })
  public progress: number

  @Field(() => Int, {
    description:
      "The computed current confidence of this entity. The confidence is always the lowest among the entity's children",
  })
  public confidence: number
}

@InputType({ description: 'A list of fields that we can filter our entity to' })
export class EntityFiltersInput {
  @Field(() => ID, {
    description:
      'The ID of the cycle we want to filter in our query. By default, it uses the closest cycle to an end as a filter, considering the creation date as a tie-breaker',
    nullable: true,
  })
  public cycleID?: CycleObject['id']
}
