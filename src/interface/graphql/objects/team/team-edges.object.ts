import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '../../interfaces/edges.interface'

import { TeamNodeGraphQLObject } from './team-node.object'

@ObjectType('TeamEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our team query interface',
})
export class TeamEdgesGraphQLObject implements EdgesGraphQLInterface<TeamNodeGraphQLObject> {
  @Field(() => [TeamNodeGraphQLObject], { complexity: 1 })
  public nodes: TeamNodeGraphQLObject[]

  public cursor: string
}
