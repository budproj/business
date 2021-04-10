import { Field, Int, ObjectType } from '@nestjs/graphql'
import { ConnectionArguments, ConnectionCursor } from 'graphql-relay'

@ObjectType('ConnectionRequest', {
  description: 'A connection request contains the basic pagination informations for your query',
})
export class ConnectionRelayRequest implements ConnectionArguments {
  @Field({
    nullable: true,
    description: 'Paginate before opaque cursor',
  })
  public readonly before?: ConnectionCursor

  @Field({
    nullable: true,
    description: 'Paginate after opaque cursor',
  })
  public readonly after?: ConnectionCursor

  @Field(() => Int, { nullable: true, description: 'Paginate first' })
  public readonly first?: number

  @Field(() => Int, { nullable: true, description: 'Paginate last' })
  public readonly last?: number
}
