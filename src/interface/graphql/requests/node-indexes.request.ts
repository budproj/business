import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class NodeIndexesRequest {
  @Field(() => ID, {
    description: 'The ID of the node you want to get in your query',
    nullable: true,
  })
  public readonly id?: string
}
