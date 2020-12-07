import { mapValues } from 'lodash'
import { FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { ACTION, RESOURCE, SCOPE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import { UserActionAllowances, UserAllowance } from 'app/graphql/user/types'
import DomainEntityService from 'domain/service'

abstract class GraphQLEntityService<E, D> {
  public readonly entityService: DomainEntityService<E, D>
  public readonly resource: RESOURCE

  constructor(
    public readonly serviceResource: RESOURCE,
    public readonly domainEntityService: DomainEntityService<E, D>,
  ) {
    this.resource = serviceResource
    this.entityService = domainEntityService
  }

  async getOneWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ) {
    const scopedConstrainedSelectors = {
      [SCOPE.ANY]: async () => this.entityService.getOne(selector),
      [SCOPE.COMPANY]: async () => this.entityService.getOneIfUserIsInCompany(selector, user),
      [SCOPE.TEAM]: async () => this.entityService.getOneIfUserIsInTeam(selector, user),
      [SCOPE.OWNS]: async () => this.entityService.getOneIfUserOwnsIt(selector, user),
    }
    const scopeConstraint = user.scopes[this.resource][action]
    const constrainedSelector = scopedConstrainedSelectors[scopeConstraint]

    return constrainedSelector()
  }

  async updateWithScopeConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthzUser,
    action: ACTION = ACTION.UPDATE,
  ) {
    const scopedConstrainedSetters = {
      [SCOPE.ANY]: async () => this.entityService.update(selector, newData),
      [SCOPE.COMPANY]: async () =>
        this.entityService.updateIfUserIsInCompany(selector, newData, user),
      [SCOPE.TEAM]: async () => this.entityService.updateIfUserIsInTeam(selector, newData, user),
      [SCOPE.OWNS]: async () => this.entityService.updateIfUserOwnsIt(selector, newData, user),
    }
    const scopeConstraint = user.scopes[this.resource][action]
    const constrainedSelector = scopedConstrainedSetters[scopeConstraint]

    return constrainedSelector()
  }

  async createWithScopeConstraint(
    data: Partial<D>,
    user: AuthzUser,
    action: ACTION = ACTION.CREATE,
  ) {
    const scopedConstrainedCreators = {
      [SCOPE.ANY]: async () => this.entityService.create(data),
      [SCOPE.COMPANY]: async () => this.entityService.createIfUserIsInCompany(data, user),
      [SCOPE.TEAM]: async () => this.entityService.createIfUserIsInTeam(data, user),
      [SCOPE.OWNS]: async () => this.entityService.createIfUserOwnsIt(data, user),
    }
    const scopeConstraint = user.scopes[this.resource][action]
    const constrainedSelector = scopedConstrainedCreators[scopeConstraint]

    return constrainedSelector()
  }

  async deleteWithScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.CREATE,
  ) {
    const scopedConstrainedCreators = {
      [SCOPE.ANY]: async () => this.entityService.delete(selector),
      [SCOPE.COMPANY]: async () => this.entityService.deleteIfUserIsInCompany(selector, user),
      [SCOPE.TEAM]: async () => this.entityService.deleteIfUserIsInTeam(selector, user),
      [SCOPE.OWNS]: async () => this.entityService.deleteIfUserOwnsIt(selector, user),
    }
    const scopeConstraint = user.scopes[this.resource][action]
    const constrainedSelector = scopedConstrainedCreators[scopeConstraint]

    return constrainedSelector()
  }

  async getUserAllowances(
    selector: FindConditions<E>,
    user: AuthzUser,
  ): Promise<UserActionAllowances> {
    const scopedConstrainedSelectors = {
      [SCOPE.ANY]: () => UserAllowance.ALLOW,
      [SCOPE.COMPANY]: async () => this.entityService.getOneIfUserIsInCompany(selector, user),
      [SCOPE.TEAM]: async () => this.entityService.getOneIfUserIsInTeam(selector, user),
      [SCOPE.OWNS]: async () => this.entityService.getOneIfUserOwnsIt(selector, user),
    }
    const actionSelectors = {
      [ACTION.CREATE]: scopedConstrainedSelectors[user.scopes[this.resource][ACTION.CREATE]],
      [ACTION.READ]: scopedConstrainedSelectors[user.scopes[this.resource][ACTION.READ]],
      [ACTION.UPDATE]: scopedConstrainedSelectors[user.scopes[this.resource][ACTION.UPDATE]],
      [ACTION.DELETE]: scopedConstrainedSelectors[user.scopes[this.resource][ACTION.DELETE]],
    }

    console.log(this.resource)

    const allowances = mapValues(
      actionSelectors,
      async (function_): Promise<UserAllowance> => {
        const foundData = await function_()

        return foundData ? UserAllowance.ALLOW : UserAllowance.DENY
      },
    )

    return allowances
  }
}

export default GraphQLEntityService
