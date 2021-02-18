import { Field, Float, ID, Int, InterfaceType, registerEnumType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'
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
