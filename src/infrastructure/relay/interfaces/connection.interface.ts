import { Field, InterfaceType } from '@nestjs/graphql'
import { Connection, Edge } from 'graphql-relay'

import { PageInfoRelayObject } from '../objects/page-info.object'

import { NodeRelayInterface } from './node.interface'

@InterfaceType('Connection', {
  description: 'This interface wraps all list connections from our schema',
})
export abstract class ConnectionRelayInterface<N extends NodeRelayInterface>
  implements Connection<N> {
  @Field(() => PageInfoRelayObject, { complexity: 0 })
  public pageInfo!: PageInfoRelayObject

  // **********************************************************************************************
  // ABSTRACTED FIELDS
  // **********************************************************************************************

  public edges!: Array<Edge<N>>
}
