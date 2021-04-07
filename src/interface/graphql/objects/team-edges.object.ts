import { Field, ObjectType } from '@nestjs/graphql'

import { EdgesGraphQLInterface } from '@interface/graphql/interfaces/edges.interface'

import { TeamNodeGraphQLObject } from './team-nodes.object'

@ObjectType('TeamEdges', {
  implements: () => EdgesGraphQLInterface,
  description: 'The edges for our team query interface',
})
export class TeamEdgesGraphQLObject implements EdgesGraphQLInterface<TeamNodeGraphQLObject> {
  @Field(() => [TeamNodeGraphQLObject])
  public nodes: TeamNodeGraphQLObject[]

  public cursor: string
}
