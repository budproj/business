import { Injectable } from '@nestjs/common'

import { AuthzUser } from 'app/authz/types'
import UserService from 'domain/user/service'
import { KeyResultViewDTO } from 'domain/user/view/key-result/dto'
import { KeyResultView } from 'domain/user/view/key-result/entities'

export interface KeyResultViewResolverRequest {
  user: AuthzUser
  id?: KeyResultViewDTO['id']
  binding?: KeyResultViewDTO['binding']
}

@Injectable()
class KeyResultViewResolverService {
  constructor(private readonly userService: UserService) {}

  async handleQueryRequest({
    user,
    id,
    binding,
  }: KeyResultViewResolverRequest): Promise<KeyResultView> {
    const keyResultView = id
      ? await this.userService.view.keyResult.getOneByIDIfUserOwnsIt(id, user)
      : await this.userService.view.keyResult.getOneByBindingIfUserOwnsIt(binding, user)

    return keyResultView
  }
}

export default KeyResultViewResolverService
