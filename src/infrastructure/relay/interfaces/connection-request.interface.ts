import { Field, Int } from '@nestjs/graphql'
import { ConnectionArguments, ConnectionCursor } from 'graphql-relay'

export abstract class ConnectionRequest implements ConnectionArguments {
  @Field({
    nullable: true,
    description: 'Paginate before opaque cursor',
  })
  public before?: ConnectionCursor

  @Field({
    nullable: true,
    description: 'Paginate after opaque cursor',
  })
  public after?: ConnectionCursor

  @Field(() => Int, { nullable: true, description: 'Paginate first' })
  public first?: number

  @Field(() => Int, { nullable: true, description: 'Paginate last' })
  public last?: number
}
