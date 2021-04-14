import { Scalar } from '@nestjs/graphql'
import { GraphQLUpload } from 'graphql-upload'

@Scalar('Upload')
export class UploadGraphQLScalar {
  description = 'File upload scalar type'

  protected parseValue(value) {
    return GraphQLUpload.parseValue(value)
  }
}
