import { Field, ID, InterfaceType } from '@nestjs/graphql'

import { PolicyObject } from 'src/app/graphql/authz/models'

@InterfaceType()
export abstract class EntityGraphQLObject {
  @Field(() => ID, { description: 'The ID of this entity' })
  public id: string

  @Field(() => PolicyObject, {
    description:
      'Group of policies regarding the given entity. Those policies decribe actions that your user can perform with that given resource',
  })
  public policies: PolicyObject
}
