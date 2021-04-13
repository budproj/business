import { Field, ObjectType } from '@nestjs/graphql'
import { ConnectionCursor } from 'graphql-relay'

import { EdgeRelayInterface } from '../../relay/interfaces/edge.interface'
import { ObjectiveGraphQLNode } from '../objective/objective.node'

@ObjectType('TeamObjectivesEdge', {
  implements: () => EdgeRelayInterface,
  description: 'This edge represents the relation between teams and their objectives',
})
export class TeamObjectivesEdgeGraphQLObject implements EdgeRelayInterface<ObjectiveGraphQLNode> {
  @Field(() => ObjectiveGraphQLNode, { complexity: 1 })
  public readonly node!: ObjectiveGraphQLNode

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly cursor!: ConnectionCursor
}
