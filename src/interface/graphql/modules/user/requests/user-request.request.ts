import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class UserRquest {
  @Field(() => ID)
  public readonly id: string
}
