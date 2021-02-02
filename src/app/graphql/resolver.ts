import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { mapValues } from 'lodash'
import { FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { ACTION, POLICY, RESOURCE } from 'src/app/authz/constants'
import { ActionPolicies, AuthzScopeGroup, AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { PolicyObject } from 'src/app/graphql/authz/models'
import { EntityObject } from 'src/app/graphql/models'
import { DomainEntity, DomainEntityService, DomainMutationQueryResult } from 'src/domain/entity'
import DomainService from 'src/domain/service'

export interface GraphQLEntityResolverInterface<E extends DomainEntity, D> {
  createWithActionScopeConstraint: (
    data: Partial<D>,
    user: AuthzUser,
    action: ACTION,
  ) => Promise<E[]>

  getOneWithActionScopeConstraint: (
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION,
  ) => Promise<E | null>
  getManyWithActionScopeConstraint: (
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION,
  ) => Promise<E[] | null>

  updateWithActionScopeConstraint: (
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthzUser,
    action: ACTION,
  ) => DomainMutationQueryResult<E>

  deleteWithActionScopeConstraint: (
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION,
  ) => DomainMutationQueryResult<E>

  getUserPolicies: (selector: FindConditions<E>, user: AuthzUser) => Promise<ActionPolicies>
}

@Resolver(() => EntityObject)
abstract class GraphQLEntityResolver<E extends DomainEntity, D>
  implements GraphQLEntityResolverInterface<E, D> {
  constructor(
    protected readonly resource: RESOURCE,
    protected readonly domainService: DomainService,
    protected readonly entityService: DomainEntityService<E, D>,
  ) {}

  @ResolveField('policies', () => PolicyObject)
  protected async getEntityPolicies(
    @Parent() entity: EntityObject,
    @GraphQLUser() user: AuthzUser,
  ) {
    const selector = { id: entity.id } as any
    // We need to use the as any until this bug is solved: https://github.com/typeorm/typeorm/issues/7338

    return this.getUserPolicies(selector, user)
  }

  public async createWithActionScopeConstraint(
    data: Partial<D>,
    user: AuthzUser,
    action: ACTION = ACTION.CREATE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.createWithConstraint(data, queryContext)
  }

  public async getOneWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.getOneWithConstraint(selector, queryContext)
  }

  public async getManyWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.getManyWithConstraint(selector, queryContext)
  }

  public async updateWithActionScopeConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthzUser,
    action: ACTION = ACTION.UPDATE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.updateWithConstraint(selector, newData, queryContext)
  }

  public async deleteWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.DELETE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.deleteWithConstraint(selector, queryContext)
  }

  public async getUserPolicies(selector: FindConditions<E>, user: AuthzUser) {
    const actionSelectors: AuthzScopeGroup = {
      [ACTION.CREATE]: user.scopes[this.resource][ACTION.CREATE],
      [ACTION.READ]: user.scopes[this.resource][ACTION.READ],
      [ACTION.UPDATE]: user.scopes[this.resource][ACTION.UPDATE],
      [ACTION.DELETE]: user.scopes[this.resource][ACTION.DELETE],
    }

    const policies: ActionPolicies = mapValues(
      actionSelectors,
      async (constraint, action: ACTION): Promise<POLICY> => {
        if (!constraint) return POLICY.DENY
        const foundData = await this.getOneWithActionScopeConstraint(selector, user, action)

        return foundData ? POLICY.ALLOW : POLICY.DENY
      },
    )

    return policies
  }
}

export default GraphQLEntityResolver
