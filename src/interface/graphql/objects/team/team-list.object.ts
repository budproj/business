import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '../../interfaces/list.interface'
import { PageInfoGraphQLObject } from '../page-info.object'

import { TeamRootEdgeGraphQLObject } from './team-root-edge.object'

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
