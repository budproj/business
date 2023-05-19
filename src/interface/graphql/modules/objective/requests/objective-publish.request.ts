import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class ObjectivePublishRequest {
  @Field(() => ID)
  public readonly id: string
}
