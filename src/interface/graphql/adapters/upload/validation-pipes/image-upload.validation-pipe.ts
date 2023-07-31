import { PipeTransform } from '@nestjs/common'
import { UserInputError } from 'apollo-server-fastify'
import { FileUpload } from 'graphql-upload'

export class ImageUploadValidationPipe implements PipeTransform {
  private readonly validMimetypes: string[]

  constructor(validMimetypes: string[] = ['image/jpeg', 'image/png', 'image/webp']) {
    this.validMimetypes = validMimetypes
  }

  public transform(file: FileUpload): FileUpload {
    this.validate(file)

    return file
  }

  private validate(file: FileUpload): void {
    const isValid = this.validMimetypes.includes(file.mimetype)

    if (!isValid) {
      throw new UserInputError(`Invalid image format. Valid mimetypes are: ${this.validMimetypes.join(', ')}`)
    }
  }
}
