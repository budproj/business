import { Field, ID, InterfaceType } from '@nestjs/graphql'

import { NodeGraphQLInterface } from './node.interface'

@InterfaceType('Edges', {
  description: 'An edge wraps selected data regarding a given entity',
})
export abstract class EdgesGraphQLInterface<N extends NodeGraphQLInterface = NodeGraphQLInterface> {
  @Field(() => ID, {
    complexity: 0,
    nullable: true,
    description: 'The last ID value returned from the current query',
  })
  public cursor?: string

  public nodes: N[]
}
