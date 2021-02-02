import { Field, ID, InterfaceType, registerEnumType } from '@nestjs/graphql'

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
