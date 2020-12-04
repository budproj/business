import { Injectable } from '@nestjs/common'

import { RESOURCE, SCOPE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import DomainUserService from 'domain/user/service'

import { UserObject } from './models'

@Injectable()
class GraphQLUserService {
  constructor(private readonly userService: DomainUserService) {}

  async getOneByIdWithScopeConstraint(id: UserObject['id'], user: AuthzUser) {
    const scopedConstrainedSelectors = {
      [SCOPE.ANY]: async () => this.userService.getOneById(id),
      [SCOPE.COMPANY]: async () => this.userService.getOneByIdIfUserIsInCompany(id, user),
      [SCOPE.TEAM]: async () => this.userService.getOneByIdIfUserIsInTeam(id, user),
      [SCOPE.OWNS]: async () => this.userService.getOneByIDIfUserOwnsIt(id, user),
    }
    const scopeConstraint = user.scopes[RESOURCE.USER]
    const constrainedSelector = scopedConstrainedSelectors[scopeConstraint]

    return constrainedSelector()
  }
}

export default GraphQLUserService
