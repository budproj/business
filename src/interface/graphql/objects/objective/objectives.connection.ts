import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '../../authorization/interfaces/guarded-connection.interface'
import { PolicyGraphQLObject } from '../../authorization/objects/policy.object'
import { ConnectionRelayInterface } from '../../relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '../../relay/objects/page-info.object'

import { ObjectiveRootEdgeGraphQLObject } from './objective-root.edge'
import { ObjectiveGraphQLNode } from './objective.node'

@ObjectType('Objectives', {
  implements: () => [ConnectionRelayInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing objectives based on the provided filters and arguments',
})
export class ObjectivesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<ObjectiveGraphQLNode> {
  @Field(() => [ObjectiveRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: ObjectiveRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: PolicyGraphQLObject
}
