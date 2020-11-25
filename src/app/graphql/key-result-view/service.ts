import { Injectable } from '@nestjs/common'

import { AuthzUser } from 'app/authz/types'
import { KeyResultViewDTO } from 'domain/key-result-view/dto'
import { KeyResultView } from 'domain/key-result-view/entities'
import KeyResultViewService from 'domain/key-result-view/service'

export interface KeyResultViewResolverRequest {
  user: AuthzUser
  id?: KeyResultViewDTO['id']
  binding?: KeyResultViewDTO['binding']
}

@Injectable()
class KeyResultViewResolverService {
  constructor(private readonly keyResultViewService: KeyResultViewService) {}

  async handleQueryRequest({
    user,
    id,
    binding,
  }: KeyResultViewResolverRequest): Promise<KeyResultView> {
    const keyResultView = id
      ? await this.keyResultViewService.getOneByIDIfUserOwnsIt(id, user)
      : await this.keyResultViewService.getOneByBindingIfUserOwnsIt(binding, user)

    return keyResultView
  }
}

export default KeyResultViewResolverService
