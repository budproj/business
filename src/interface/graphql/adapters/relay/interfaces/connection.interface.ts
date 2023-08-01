import { Field, ID, InterfaceType } from '@nestjs/graphql'
import { Connection as RelayConnection, Edge } from 'graphql-relay'

import { PageInfoRelayObject } from '../objects/page-info.object'

import { NodeRelayGraphQLInterface } from './node.interface'

export interface Connection<N> extends RelayConnection<N> {
  parentNodeId?: string
}

@InterfaceType('ConnectionInterface', {
  description: 'This interface wraps all list connections from our schema',
})
export abstract class ConnectionRelayGraphQLInterface<N extends NodeRelayGraphQLInterface>
  implements Connection<N>
{
  @Field(() => PageInfoRelayObject, { complexity: 0 })
  public readonly pageInfo!: PageInfoRelayObject

  @Field(() => ID, { complexity: 0 })
  public readonly parentNodeId!: string

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly edges!: Array<Edge<N>>
}
