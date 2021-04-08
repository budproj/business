import { Field, ObjectType } from '@nestjs/graphql'

import { QueryResultGraphQLInterface } from '@interface/graphql/interfaces/query-result.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { TeamEdgesGraphQLObject } from './team-edges.object'

@ObjectType('TeamQueryResult', {
  implements: () => QueryResultGraphQLInterface,
  description: 'The query result containing teams based on the provided filters and arguments',
})
export class TeamQueryResultGraphQLObject
  implements QueryResultGraphQLInterface<TeamEdgesGraphQLObject> {
  @Field(() => TeamEdgesGraphQLObject)
  public edges: TeamEdgesGraphQLObject

  public pageInfo: PageInfoGraphQLObject
}
