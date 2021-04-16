import { PipeTransform } from '@nestjs/common'

import { ImageUploadValidationPipe } from '@interface/graphql/upload/validation-pipes/image-upload.validation-pipe'

import { UserUpdateRequest } from '../requests/user-update.request'

export class UserUpdateRequestValidationPipe implements PipeTransform {
  private readonly imageUploadPipe = new ImageUploadValidationPipe()

  public async transform(request: UserUpdateRequest) {
    const resolvedPicture = await request.data.picture
    if (resolvedPicture) this.imageUploadPipe.transform(resolvedPicture)

    return request
  }
}
