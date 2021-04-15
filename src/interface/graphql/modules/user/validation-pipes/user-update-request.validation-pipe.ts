import { PipeTransform } from '@nestjs/common'

import { ImageUploadValidationPipe } from '@interface/graphql/validation-pipes/image-upload.validation-pipe'

import { UserUpdateRequest } from '../requests/user-update.request'

export class UserUpdateRequestValidationPipe implements PipeTransform {
  private readonly imageUploadPipe = new ImageUploadValidationPipe()

  public async transform(request: UserUpdateRequest) {
    const picture = await request.data.picture
    this.imageUploadPipe.transform(picture)

    return request
  }
}
