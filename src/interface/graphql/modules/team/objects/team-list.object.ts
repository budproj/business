import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '@interface/graphql/interfaces/list.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { TeamRootEdgeGraphQLObject } from '../edges/team-root.edge'

@ObjectType('TeamList', {
  implements: () => ListGraphQLInterface,
  description: 'A list containing teams based on the provided filters and arguments',
})
export class TeamListGraphQLObject implements ListGraphQLInterface<TeamRootEdgeGraphQLObject> {
  @Field(() => [TeamRootEdgeGraphQLObject], { complexity: 0 })
  public edges: TeamRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
