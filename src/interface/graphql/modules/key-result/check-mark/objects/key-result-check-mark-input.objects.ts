import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('KeyResultCheckMarkInput', { description: 'The required data to create a new check mark' })
export class KeyResultCheckMarkInputObject {

  @Field(() => String, { description: 'The description of the check mark' })
  description: string

  @Field(() => ID, { description: 'The key result ID related to this check mark' })
  keyResultId: string
}

@InputType('KeyResultCheckMarkToggleInput', { description: 'The required data to toggle a check mark' })
export class KeyResultCheckMarkToggleObject {
  @Field(() => String, { description: 'The ID of the check mark' })
  id: string
}
