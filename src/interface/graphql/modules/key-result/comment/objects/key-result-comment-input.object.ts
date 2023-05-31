import { Field, ID, InputType } from '@nestjs/graphql'

import { KeyResultCommentType } from '@core/modules/key-result/enums/key-result-comment-type.enum'

@InputType('KeyResultCommentInput', { description: 'The required data to create a new comment' })
export class KeyResultCommentInputObject {
  @Field(() => String, { description: 'The text of the comment' })
  public text: string

  @Field(() => ID, { description: 'The key result ID related to this comment' })
  public keyResultId: string

  @Field(() => String, { description: 'The key result comment type' })
  public type?: KeyResultCommentType
}
