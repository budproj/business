import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { TeamRootEdgeGraphQLObject } from './team-root.edge'
import { TeamGraphQLNode } from './team.node'

@ObjectType('Teams', {
  implements: () => ConnectionRelayInterface,
  description: 'A list containing teams based on the provided filters and arguments',
})
export class TeamsGraphQLConnection implements ConnectionRelayInterface<TeamGraphQLNode> {
  @Field(() => [TeamRootEdgeGraphQLObject], { complexity: 0 })
  public edges!: TeamRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo!: PageInfoRelayObject
}
