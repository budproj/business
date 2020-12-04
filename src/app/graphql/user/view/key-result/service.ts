import { Injectable } from '@nestjs/common'

import { RESOURCE, SCOPE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import GraphQLEntityService from 'app/graphql/service'
import DomainKeyResultViewService from 'domain/user/view/key-result/service'
import { KeyResultViewBinding } from 'domain/user/view/key-result/types'

@Injectable()
class GraphQLKeyResultViewService extends GraphQLEntityService<DomainKeyResultViewService> {
  constructor(public readonly keyResultViewService: DomainKeyResultViewService) {
    super(RESOURCE.KEY_RESULT_VIEW, keyResultViewService)
  }

  async getOneByBindingWithScopeConstraint(binding: KeyResultViewBinding, user: AuthzUser) {
    const scopedConstrainedSelectors = {
      [SCOPE.ANY]: async () => this.entityService.getOneByBinding(binding),
      [SCOPE.COMPANY]: async () =>
        this.entityService.getOneByBindingIfUserIsInCompany(binding, user),
      [SCOPE.TEAM]: async () => this.entityService.getOneByBindingIfUserIsInTeam(binding, user),
      [SCOPE.OWNS]: async () => this.entityService.getOneByBindingIfUserOwnsIt(binding, user),
    }
    const scopeConstraint = user.scopes[RESOURCE.KEY_RESULT_VIEW]
    const constrainedSelector = scopedConstrainedSelectors[scopeConstraint]

    return constrainedSelector()
  }
}

export default GraphQLKeyResultViewService
