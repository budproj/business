import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class NodeDeleteRequest {
  @Field(() => ID)
  public readonly id: string
}
