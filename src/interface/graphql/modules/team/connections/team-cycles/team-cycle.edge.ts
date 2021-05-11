import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/edge.interface'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'

@ObjectType('TeamCycleEdge', {
  implements: () => EdgeRelayGraphQLInterface,
  description: 'This edge represents the relation between teams and their cycles',
})
export class TeamCycleEdgeGraphQLObject implements EdgeRelayGraphQLInterface<CycleGraphQLNode> {
  @Field(() => CycleGraphQLNode, { complexity: 1 })
  public readonly node!: CycleGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
