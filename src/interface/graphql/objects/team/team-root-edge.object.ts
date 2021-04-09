import { Field, ObjectType } from '@nestjs/graphql'

import { EdgeGraphQLInterface } from '../../interfaces/edge.interface'

import { TeamNodeGraphQLObject } from './team-node.object'

@ObjectType('TeamRootEdge', {
  implements: () => EdgeGraphQLInterface,
  description: 'The edge for our team query interface',
})
export class TeamRootEdgeGraphQLObject implements EdgeGraphQLInterface<TeamNodeGraphQLObject> {
  @Field(() => TeamNodeGraphQLObject, { complexity: 1 })
  public node: TeamNodeGraphQLObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public cursor: string
}
