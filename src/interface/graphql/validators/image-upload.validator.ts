import { PipeTransform } from '@nestjs/common'
import { UserInputError } from 'apollo-server-fastify'

export class ImageUploadValidationPipe implements PipeTransform {
  async transform(value: any) {
    const picture = await value.data.picture
    console.log(picture)
    throw new UserInputError('TESTE')
  }
}
