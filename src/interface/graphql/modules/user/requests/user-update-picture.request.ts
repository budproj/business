import { ArgsType, Field, ID } from '@nestjs/graphql'
import { GraphQLUpload, FileUpload } from 'graphql-upload'

@ArgsType()
export class UserUpdatePictureRequest {
  @Field(() => ID)
  public readonly id!: string

  @Field(() => GraphQLUpload)
  public readonly picture!: FileUpload
}
