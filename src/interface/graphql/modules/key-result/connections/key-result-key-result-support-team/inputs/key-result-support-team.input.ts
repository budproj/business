import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('KeyResultAddUserToSupportTeamInput', {
  description: 'Data required to add a user to support team',
})
export class KeyResultAddUserToSupportTeamInput {
  @Field(() => ID, { description: 'The id of the key result' })
  public readonly keyResultId: string

  @Field(() => ID, { description: 'The id of the user to be added' })
  public readonly userId: string
}

@InputType('KeyResultRemoveUserToSupportTeamInput', {
  description: 'Data required to remove a user to support team',
})
export class KeyResultRemoveUserToSupportTeamInput {
  @Field(() => ID, { description: 'The id of the key result' })
  public readonly keyResultId: string

  @Field(() => ID, { description: 'The id of the user to be removed' })
  public readonly userId: string
}
