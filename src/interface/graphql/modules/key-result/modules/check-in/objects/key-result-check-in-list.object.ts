import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionGraphQLInterface } from '@interface/graphql/interfaces/connection.interface'
import { PageInfoGraphQLObject } from '@interface/graphql/objects/page-info.object'

import { KeyResultCheckInRootEdgeGraphQLObject } from '../edges/key-result-check-in-root.edge'

@ObjectType('KeyResultCheckInList', {
  implements: () => ConnectionGraphQLInterface,
  description: 'A list containing key-result comments based on the provided filters and arguments',
})
export class KeyResultCheckInListGraphQLObject
  implements ConnectionGraphQLInterface<KeyResultCheckInRootEdgeGraphQLObject> {
  @Field(() => [KeyResultCheckInRootEdgeGraphQLObject], { complexity: 0 })
  public edges: KeyResultCheckInRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo: PageInfoGraphQLObject
}
