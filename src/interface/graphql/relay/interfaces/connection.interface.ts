import { Field, InterfaceType } from '@nestjs/graphql'
import { Connection, Edge } from 'graphql-relay'

import { PageInfoRelayObject } from '../objects/page-info.object'

import { NodeRelayInterface } from './node.interface'

@InterfaceType('ConnectionInterface', {
  description: 'This interface wraps all list connections from our schema',
})
export abstract class ConnectionRelayInterface<N extends NodeRelayInterface>
  implements Connection<N> {
  @Field(() => PageInfoRelayObject, { complexity: 0 })
  public readonly pageInfo!: PageInfoRelayObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public readonly edges!: Array<Edge<N>>
}
