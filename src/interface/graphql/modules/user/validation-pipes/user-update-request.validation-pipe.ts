import { PipeTransform } from '@nestjs/common'

import { ImageUploadValidationPipe } from '@interface/graphql/validation-pipes/image-upload.validation-pipe'

import { UserUpdateRequest } from '../requests/user-update.request'

export class UserUpdateRequestValidationPipe implements PipeTransform {
  private readonly imageUploadPipe = new ImageUploadValidationPipe()

  public async transform(request: UserUpdateRequest) {
    const picture = await this.parsePicture(request)
    const transformedData = this.normalizeRequest(picture, request)

    return transformedData
  }

  private async parsePicture(request: UserUpdateRequest): Promise<string> {
    const picture = await request.data.picture
    const picturePath = await this.imageUploadPipe.transform(picture)

    return picturePath
  }

  private normalizeRequest(picture: string, request: UserUpdateRequest) {
    return {
      ...request,
      data: {
        ...request.data,
        picture,
      },
    }
  }
}
