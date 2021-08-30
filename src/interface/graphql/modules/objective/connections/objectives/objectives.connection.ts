import { Field, ObjectType } from '@nestjs/graphql'

import { GuardedConnectionGraphQLInterface } from '@interface/graphql/adapters/authorization/interfaces/guarded-connection.interface'
import { ConnectionPolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/connection-policy.object'
import { ConnectionRelayGraphQLInterface } from '@interface/graphql/adapters/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@interface/graphql/adapters/relay/objects/page-info.object'

import { ObjectiveGraphQLNode } from '../../objective.node'

import { ObjectiveRootEdgeGraphQLObject } from './objective-root.edge'

@ObjectType('Objectives', {
  implements: () => [ConnectionRelayGraphQLInterface, GuardedConnectionGraphQLInterface],
  description: 'A list containing objectives based on the provided filters and arguments',
})
export class ObjectivesGraphQLConnection
  implements GuardedConnectionGraphQLInterface<ObjectiveGraphQLNode>
{
  @Field(() => [ObjectiveRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: ObjectiveRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
  public readonly policy!: ConnectionPolicyGraphQLObject
  public readonly parentNodeId!: string
}
