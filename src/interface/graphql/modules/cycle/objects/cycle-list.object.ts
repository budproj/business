import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionGraphQLInterface } from '@interface/graphql/interfaces/connection.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { CycleRootEdgeGraphQLObject } from '../edges/cycle-root.edge'

@ObjectType('CycleList', {
  implements: () => ConnectionGraphQLInterface,
  description: 'A list containing cycles based on the provided filters and arguments',
})
export class CycleListGraphQLObject
  implements ConnectionGraphQLInterface<CycleRootEdgeGraphQLObject> {
  @Field(() => [CycleRootEdgeGraphQLObject], { complexity: 0 })
  public edges: CycleRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
