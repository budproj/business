import { ArgsType, Field, ID } from '@nestjs/graphql'

@ArgsType()
export class UserFiltersRequest {
  @Field(() => ID, { nullable: true })
  public id?: string
}
