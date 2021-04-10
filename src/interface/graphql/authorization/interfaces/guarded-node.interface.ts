import { Field, InterfaceType } from '@nestjs/graphql'

import { NodeRelayInterface } from '@infrastructure/relay/interfaces/node.interface'

import { PolicyGraphQLObject } from '../objects/policy.object'

@InterfaceType('GuardedNodeInterface', {
  implements: () => NodeRelayInterface,
  description: 'A guarded node is like a common node, but with an extra policy field',
})
export abstract class GuardedNodeGraphQLInterface extends NodeRelayInterface {
  @Field(() => PolicyGraphQLObject, {
    complexity: 1,
    description:
      'The policy for this node. It decribes actions that your user can perform with that given resource',
  })
  public readonly policy?: PolicyGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly id!: string
  public readonly createdAt!: Date
}
