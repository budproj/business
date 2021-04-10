import { Field, ID, InterfaceType } from '@nestjs/graphql'

import { NodeRelayInterface } from '@infrastructure/relay/interfaces/node.interface'

import { PolicyGraphQLObject } from '../objects/policy.object'

@InterfaceType('GuardedNode', {
  description: 'A guarded node is like a common node, but with an extra policy field',
})
export abstract class GuardedNodeGraphQLInterface implements NodeRelayInterface {
  @Field(() => ID, { complexity: 0, description: 'The ID of this node' })
  public id!: string

  @Field({ complexity: 0, description: 'The creation date of the entity' })
  public createdAt!: Date

  @Field(() => PolicyGraphQLObject, {
    complexity: 1,
    description:
      'The policy for this node. It decribes actions that your user can perform with that given resource',
  })
  public policy?: PolicyGraphQLObject
}
