import { PipeTransform } from '@nestjs/common'
import { FileUpload } from 'graphql-upload'

export class ImageUploadValidationPipe implements PipeTransform {
  async transform(file: FileUpload): Promise<string> {
    console.log(file)

    return 'ok'
  }
}
