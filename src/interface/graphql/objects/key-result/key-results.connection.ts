import { Field, ObjectType } from '@nestjs/graphql'

import { ConnectionRelayInterface } from '@infrastructure/relay/interfaces/connection.interface'
import { PageInfoRelayObject } from '@infrastructure/relay/objects/page-info.object'

import { KeyResultRootEdgeGraphQLObject } from './key-result-root.edge'
import { KeyResultGraphQLNode } from './key-result.node'

@ObjectType('KeyResults', {
  implements: () => ConnectionRelayInterface,
  description: 'A list containing key-results based on the provided filters and arguments',
})
export class KeyResultsGraphQLConnection implements ConnectionRelayInterface<KeyResultGraphQLNode> {
  @Field(() => [KeyResultRootEdgeGraphQLObject], { complexity: 0 })
  public readonly edges!: KeyResultRootEdgeGraphQLObject[]

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly pageInfo!: PageInfoRelayObject
}
