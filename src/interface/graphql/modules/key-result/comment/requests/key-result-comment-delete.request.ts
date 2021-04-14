import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class KeyResultCommentDeleteRequest {
  @Field(() => ID, {
    description: 'The ID of the key-result comment you want to delete',
  })
  public readonly id: string
}
