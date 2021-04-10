import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionGraphQLInterface } from '@interface/graphql/interfaces/connection.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { KeyResultRootEdgeGraphQLObject } from '../edges/key-result-root.edge'

@ObjectType('KeyResultList', {
  implements: () => ConnectionGraphQLInterface,
  description: 'A list containing key-results based on the provided filters and arguments',
})
export class KeyResultListGraphQLObject
  implements ConnectionGraphQLInterface<KeyResultRootEdgeGraphQLObject> {
  @Field(() => [KeyResultRootEdgeGraphQLObject], { complexity: 0 })
  public edges: KeyResultRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
