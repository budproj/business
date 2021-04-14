import { Field, ID, InputType } from '@nestjs/graphql'

@InputType({ description: 'The required data to create a new comment' })
export class KeyResultCommentInputObject {
  @Field(() => String, { description: 'The text of the comment' })
  public text: string

  @Field(() => ID, { description: 'The key result ID related to this comment' })
  public keyResultId: string
}
