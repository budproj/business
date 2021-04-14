import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class KeyResultCheckInDeleteRequest {
  @Field(() => ID, {
    description: 'The ID of the key-result check-in you want to delete',
  })
  public readonly id: string
}
