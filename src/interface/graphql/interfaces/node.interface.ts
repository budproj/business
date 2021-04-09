import { Field, ID, InterfaceType } from '@nestjs/graphql'

import { PolicyGraphQLObject } from '../authorization/objects/policy.object'

@InterfaceType('Node', {
  description:
    'An GraphQL node relates directly with our domain structure. It is a relevent object in our domain architecture',
})
export abstract class NodeGraphQLInterface {
  @Field(() => ID, { complexity: 0, description: 'The ID of this entity' })
  public id: string

  @Field({ complexity: 0, description: 'The creation date of the entity' })
  public createdAt: Date

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => PolicyGraphQLObject, {
    complexity: 1,
    description:
      'The policy for this node. It decribes actions that your user can perform with that given resource',
  })
  public policy?: PolicyGraphQLObject
}
