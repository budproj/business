import { ArgsType, Field, Int } from '@nestjs/graphql'
import { ConnectionArguments, ConnectionCursor } from 'graphql-relay'

@ArgsType()
export class ConnectionRelayRequest implements ConnectionArguments {
  @Field(() => Int, { defaultValue: 20, description: 'Paginate first' })
  public readonly first: number

  @Field(() => Int, { nullable: true, description: 'Paginate last' })
  public readonly last?: number

  @Field({
    nullable: true,
    description: 'Paginate after opaque cursor',
  })
  public readonly after?: ConnectionCursor

  @Field({
    nullable: true,
    description: 'Paginate before opaque cursor',
  })
  public readonly before?: ConnectionCursor
}
