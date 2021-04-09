import { Field, ObjectType } from '@nestjs/graphql'

import { ListGraphQLInterface } from '../../interfaces/list.interface'
import { PageInfoGraphQLObject } from '../page-info.object'

import { CycleRootEdgeGraphQLObject } from './cycle-root-edge.object'

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
