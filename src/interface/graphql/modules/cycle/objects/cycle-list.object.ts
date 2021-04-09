import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '@interface/graphql/interfaces/list.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { CycleRootEdgeGraphQLObject } from '../edges/cycle-root.edge'

@ObjectType('CycleList', {
  implements: () => ListGraphQLInterface,
  description: 'A list containing cycles based on the provided filters and arguments',
})
export class CycleListGraphQLObject implements ListGraphQLInterface<CycleRootEdgeGraphQLObject> {
  @Field(() => [CycleRootEdgeGraphQLObject], { complexity: 0 })
  public edges: CycleRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
