import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class KeyResultCheckMarkDeleteRequest {
  @Field(() => ID)
  public readonly id: string
}
