import { Args, ResolveField, Resolver } from '@nestjs/graphql'
import { FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { ACTION, RESOURCE } from 'src/app/authz/constants'
import AuthzService from 'src/app/authz/service'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { PolicyObject } from 'src/app/graphql/authz/models'
import { EntityObject } from 'src/app/graphql/models'
import { CONSTRAINT } from 'src/domain/constants'
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
}

@Resolver(() => EntityObject)
abstract class GraphQLEntityResolver<E extends DomainEntity, D>
  implements GraphQLEntityResolverInterface<E, D> {
  constructor(
    protected readonly resource: RESOURCE,
    protected readonly domainService: DomainService,
    protected readonly entityService: DomainEntityService<E, D>,
    protected readonly authzService: AuthzService,
  ) {}

  @ResolveField('policies', () => PolicyObject)
  protected async getEntityPolicies(
    @Args('constraint', { type: () => CONSTRAINT, defaultValue: CONSTRAINT.COMPANY })
    constraint: CONSTRAINT,
    @GraphQLUser() authzUser: AuthzUser,
  ) {
    const userPermissions = this.authzService.getUserPermissionsForScope(authzUser, constraint)
    const resourcePolicies = userPermissions[this.resource]

    return resourcePolicies
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
}

export default GraphQLEntityResolver
