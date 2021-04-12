import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class KeyResultCommentDeleteRequest {
  @Field(() => ID)
  public readonly id: string
}
