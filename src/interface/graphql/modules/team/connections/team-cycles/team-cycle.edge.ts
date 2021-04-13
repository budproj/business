import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { EdgeRelayInterface } from '@interface/graphql/relay/interfaces/edge.interface'

@ObjectType('TeamCycleEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between teams and their cycles',
})
export class TeamCycleEdgeGraphQLObject implements EdgeRelayInterface<CycleGraphQLNode> {
  @Field(() => CycleGraphQLNode, { complexity: 1 })
  public readonly node!: CycleGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
