import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '../../relay/interfaces/edge.interface'

import { TeamGraphQLNode } from './team.node'

@ObjectType('TeamRootEdge', {
  implements: () => EdgeRelayInterface,
  description: 'The edge for our team query interface',
})
export class TeamRootEdgeGraphQLObject implements EdgeRelayInterface<TeamGraphQLNode> {
  @Field(() => TeamGraphQLNode, { complexity: 1 })
  public readonly node!: TeamGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
