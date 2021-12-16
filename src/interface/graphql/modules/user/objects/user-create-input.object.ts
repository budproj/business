import { Field, ID, InputType } from '@nestjs/graphql'

import { UserGender } from '@core/modules/user/enums/user-gender.enum'

import { UserGenderGraphQLEnum } from '../enums/user-gender.enum'

@InputType('UserCreateInput', {
  description: 'Data that you need to provide while creating a new user',
})
export class UserCreateInputObject {
  @Field(() => String, { description: 'The first name of the user' })
  public readonly firstName: string

  @Field(() => String, { description: 'The last name of the user' })
  public readonly lastName: string

  @Field(() => String, { description: 'The role of the user in her/his company', nullable: true })
  public readonly role?: string

  @Field(() => UserGenderGraphQLEnum, {
    description: 'The gender of the user',
  })
  public readonly gender: UserGender

  @Field(() => String, {
    description: 'The e-mail for the user',
  })
  public readonly email: string

  @Field(() => ID, {
    description: 'The ID of the primary team for this user',
  })
  public readonly teamID: string

  @Field(() => String, {
    nullable: true,
    description: 'The locale for this user',
  })
  public readonly locale?: string
}
