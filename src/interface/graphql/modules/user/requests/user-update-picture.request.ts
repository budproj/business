import { ArgsType, Field, ID } from '@nestjs/graphql'

import { UploadGraphQLScalar } from '@interface/graphql/scalars/upload.scalar'

@ArgsType()
export class UserUpdatePictureRequest {
  @Field(() => ID)
  public readonly id!: string

  @Field(() => UploadGraphQLScalar)
  public readonly picture!: UploadGraphQLScalar
}
