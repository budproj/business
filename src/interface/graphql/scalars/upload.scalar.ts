import { Scalar } from '@nestjs/graphql'
import { GraphQLUpload, FileUpload } from 'graphql-upload'

import { StorageProvider } from '@infrastructure/storage/storage.provider'

@Scalar('Upload')
export class UploadGraphQLScalar {
  protected readonly storage: StorageProvider
  protected readonly validMimetypes: string[]

  protected parseValue(value): FileUpload {
    return GraphQLUpload.parseValue(value)
  }
}
