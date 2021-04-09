import { Field, ID, InterfaceType } from '@nestjs/graphql'

import { PolicyGraphQLObject } from '../authorization/objects/policy.object'

import { NodeGraphQLInterface } from './node.interface'

@InterfaceType('Edges', {
  description: 'An edge wraps selected data regarding a given entity',
})
export abstract class EdgeGraphQLInterface<N extends NodeGraphQLInterface = NodeGraphQLInterface> {
  @Field(() => ID, {
    complexity: 0,
    nullable: true,
    description: 'The cursor value of this node',
  })
  public cursor?: string

  // **********************************************************************************************
  // RESOLVED FIELDS
  // **********************************************************************************************

  @Field(() => PolicyGraphQLObject, {
    complexity: 1,
    description:
      'The policy regarding the current edge. Those policies decribe actions that your user can perform for this edge',
  })
  public policy?: PolicyGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public node: N
}
