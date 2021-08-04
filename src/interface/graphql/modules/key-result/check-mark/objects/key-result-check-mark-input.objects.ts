import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('KeyResultCheckMarkInput', { description: 'The required data to create a new check mark' })
export class KeyResultCheckMarkInputObject {
  // TODO: state: CheckMarkStates

  @Field(() => String, { description: 'The description of the check mark' })
  description: string

  @Field(() => ID, { description: 'The key result ID related to this check mark' })
  keyResultId: string
}
