import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('KeyResultCheckMarkInput', {
  description: 'The required data to create a new check mark',
})
export class KeyResultCheckMarkInputObject {
  @Field(() => String, { description: 'The description of the check mark' })
  description: string

  @Field(() => ID, { description: 'The key result ID related to this check mark' })
  keyResultId: string
}

@InputType('KeyResultCheckMarkToggleInput', {
  description: 'The required data to toggle a check mark',
})
export class KeyResultCheckMarkToggleObject {
  @Field(() => ID, { description: 'The ID of the check mark' })
  id: string
}

@InputType('KeyResultCheckMarkUpdateDescriptionInput', {
  description: 'The required data to update a check mark description',
})
export class KeyResultCheckMarkUpdateDescriptionInputObject {
  @Field(() => String, { description: 'The new description of the check mark' })
  description: string
}

@InputType('KeyResultCheckMarkUpdateAssigneeInput', {
  description: 'The required data to update a check mark assigned user',
})
export class KeyResultCheckMarkUpdateAssigneeInputObject {
  @Field(() => ID, { description: 'The new user id to assign the check mark' })
  assignedUserId: string
}
