import { mapValues } from 'lodash'
import { FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { ACTION, RESOURCE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import { USER_POLICY } from 'app/graphql/user/constants'
import { UserActionPolicies } from 'app/graphql/user/types'
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
    const scopeConstraint = user.scopes[this.resource][action]

    return this.entityService.getOneWithConstraint(scopeConstraint, selector, user)
  }

  async getManyWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]

    return this.entityService.getManyWithConstraint(scopeConstraint, user, selector)
  }

  async updateWithScopeConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthzUser,
    action: ACTION = ACTION.UPDATE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]

    return this.entityService.updateWithConstraint(scopeConstraint, selector, newData, user)
  }

  async createWithScopeConstraint(
    data: Partial<D>,
    user: AuthzUser,
    action: ACTION = ACTION.CREATE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]

    return this.entityService.createWithConstraint(scopeConstraint, data, user)
  }

  async deleteWithScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.CREATE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]

    return this.entityService.deleteWithConstraint(scopeConstraint, selector, user)
  }

  async getUserPolicies(selector: FindConditions<E>, user: AuthzUser): Promise<UserActionPolicies> {
    const actionSelectors = {
      [ACTION.CREATE]: user.scopes[this.resource][ACTION.CREATE],
      [ACTION.READ]: user.scopes[this.resource][ACTION.READ],
      [ACTION.UPDATE]: user.scopes[this.resource][ACTION.UPDATE],
      [ACTION.DELETE]: user.scopes[this.resource][ACTION.DELETE],
    }

    const policies = mapValues(
      actionSelectors,
      async (constraint): Promise<USER_POLICY> => {
        if (!constraint) return USER_POLICY.DENY
        const foundData = await this.entityService.getOneWithConstraint(constraint, selector, user)

        return foundData ? USER_POLICY.ALLOW : USER_POLICY.DENY
      },
    )

    return policies
  }
}

export default GraphQLEntityService
