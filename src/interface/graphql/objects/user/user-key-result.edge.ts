import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '@infrastructure/relay/interfaces/edge.interface'

import { KeyResultGraphQLNode } from '../key-result/key-result.node'

@ObjectType('UserKeyResultEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between users and their key-results',
})
export class UserKeyResultEdgeGraphQLObject implements EdgeRelayInterface<KeyResultGraphQLNode> {
  @Field(() => KeyResultGraphQLNode, { complexity: 1 })
  public readonly node!: KeyResultGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}