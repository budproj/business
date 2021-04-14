import { Scalar } from '@nestjs/graphql'
import { GraphQLUpload } from 'graphql-upload'

@Scalar('Upload')
export class UploadGraphQLScalar {
  public get description(): string {
    return 'File upload scalar type'
  }

  protected parseValue(value): string {
    const file = GraphQLUpload.parseValue(value)
    console.log(file)

    return 'ok'
  }
}
