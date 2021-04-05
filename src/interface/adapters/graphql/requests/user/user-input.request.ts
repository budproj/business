import { Field, InputType } from '@nestjs/graphql'

import { USER_GENDER } from 'src/domain/user/constants'
import '@interface/adapters/graphql/enums/user-gender.enum'

@InputType({ description: 'Data that you can assign to a given user' })
export class UserInputRequest {
  @Field(() => String, { description: 'The first name of the user', nullable: true })
  public firstName?: string

  @Field(() => String, { description: 'The last name of the user', nullable: true })
  public lastName?: string

  @Field(() => USER_GENDER, {
    description:
      'The gender of the user. The gender is used to define how we would call that given user',
    nullable: true,
  })
  public gender?: USER_GENDER

  @Field(() => String, { description: 'The role of the user in her/his company', nullable: true })
  public role?: string

  @Field(() => String, {
    description: 'The custom nickname that user wants to be called',
    nullable: true,
  })
  public nickname?: string

  @Field(() => String, {
    description:
      'A description for that user. A more detailed information where the user tells about her/himself',
    nullable: true,
  })
  public about?: string

  @Field(() => String, {
    description: "The URL for the user's LinkedIn profile",
    nullable: true,
  })
  public linkedInProfileAddress?: string
}
