import { Field, ID, InterfaceType } from '@nestjs/graphql'

import { PolicyGraphQLObject } from '../objects/policy.object'

@InterfaceType('Entity', {
  description:
    'An entity relates directly with our domain structure. It is a relevent object in our domain architecture',
})
export abstract class EntityGraphQLInterface {
  @Field(() => ID, { description: 'The ID of this entity' })
  public id: string

  @Field(() => PolicyGraphQLObject, {
    description:
      'Group of policies regarding the given entity. Those policies decribe actions that your user can perform with that given resource',
  })
  public policies?: PolicyGraphQLObject
}
