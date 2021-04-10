import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { ObjectiveRootEdgeGraphQLObject } from './objective-root.edge'
import { ObjectiveGraphQLNode } from './objective.node'

@ObjectType('Objectives', {
  implements: () => ConnectionRelayInterface,
  description: 'A list containing objectives based on the provided filters and arguments',
})
export class ObjectivesGraphQLConnection implements ConnectionRelayInterface<ObjectiveGraphQLNode> {
  @Field(() => [ObjectiveRootEdgeGraphQLObject], { complexity: 0 })
  public edges!: ObjectiveRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public pageInfo!: PageInfoRelayObject
}
