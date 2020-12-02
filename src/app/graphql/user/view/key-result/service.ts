import { Injectable } from '@nestjs/common'

import { AuthzUser } from 'app/authz/types'
import { KeyResultViewObject } from 'app/graphql/user/view/key-result/models'
import DomainUserService from 'domain/user/service'
import { KeyResultView } from 'domain/user/view/key-result/entities'

export interface GraphQLKeyResultViewHandleQueryRequestProperties {
  user: AuthzUser
  id?: KeyResultViewObject['id']
  binding?: KeyResultViewObject['binding']
}

@Injectable()
class GraphQLKeyResultViewResolverService {
  constructor(private readonly userService: DomainUserService) {}

  async handleQueryRequest({
    user,
    id,
    binding,
  }: GraphQLKeyResultViewHandleQueryRequestProperties): Promise<KeyResultView> {
    const keyResultView = id
      ? await this.userService.view.keyResult.getOneByIDIfUserOwnsIt(id, user)
      : await this.userService.view.keyResult.getOneByBindingIfUserOwnsIt(binding, user)

    return keyResultView
  }
}

export default GraphQLKeyResultViewResolverService
