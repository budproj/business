import { Field, InterfaceType } from '@nestjs/graphql'

import { NodeRelayGraphQLInterface } from '../../relay/interfaces/node.interface'
import { NodePolicyGraphQLObject } from '../objects/node-policy.object'

@InterfaceType('GuardedNodeInterface', {
  implements: () => NodeRelayGraphQLInterface,
  description: 'A guarded node is like a common node, but with an extra policy field',
})
export abstract class GuardedNodeGraphQLInterface extends NodeRelayGraphQLInterface {
  @Field(() => NodePolicyGraphQLObject, {
    complexity: 1,
    description:
      'The policy for this node. It decribes actions that your user can perform with that given resource',
  })
  public readonly policy?: NodePolicyGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
}
