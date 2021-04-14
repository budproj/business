import { Field, InputType } from '@nestjs/graphql'
import { FileUpload } from 'graphql-upload'

import { UploadGraphQLScalar } from '@interface/graphql/scalars/upload.scalar'

@InputType({ description: 'Data that you can assign to a given user' })
export class UserInputObject {
  @Field(() => String, { description: 'The first name of the user', nullable: true })
  public readonly firstName?: string

  @Field(() => String, { description: 'The last name of the user', nullable: true })
  public readonly lastName?: string

  @Field(() => UploadGraphQLScalar, {
    nullable: true,
    description: 'An image file that we will upload and user as the new user picture',
  })
  public readonly picture?: Promise<FileUpload>

  @Field(() => String, { description: 'The role of the user in her/his company', nullable: true })
  public readonly role?: string

  @Field(() => String, {
    description: 'The custom nickname that user wants to be called',
    nullable: true,
  })
  public readonly nickname?: string

  @Field(() => String, {
    description:
      'A description for that user. A more detailed information where the user tells about her/himself',
    nullable: true,
  })
  public readonly about?: string

  @Field(() => String, {
    description: "The URL for the user's LinkedIn profile",
    nullable: true,
  })
  public readonly linkedInProfileAddress?: string
}
