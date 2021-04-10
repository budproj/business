import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionGraphQLInterface } from '@interface/graphql/interfaces/connection.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { TeamRootEdgeGraphQLObject } from '../edges/team-root.edge'

@ObjectType('TeamList', {
  implements: () => ConnectionGraphQLInterface,
  description: 'A list containing teams based on the provided filters and arguments',
})
export class TeamListGraphQLObject
  implements ConnectionGraphQLInterface<TeamRootEdgeGraphQLObject> {
  @Field(() => [TeamRootEdgeGraphQLObject], { complexity: 0 })
  public edges: TeamRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
