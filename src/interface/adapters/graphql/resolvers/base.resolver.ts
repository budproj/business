import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { mapValues } from 'lodash'
import { DeleteResult, FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { ACTION, POLICY, RESOURCE } from 'src/app/authz/constants'
import AuthzService from 'src/app/authz/service'
import { ActionPolicies, AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { PolicyObject } from 'src/app/graphql/authz/models'
import { EntityObject } from 'src/app/graphql/models'
import { CONSTRAINT } from 'src/domain/constants'
import { DomainEntity, DomainEntityService } from 'src/domain/entity'
import DomainService from 'src/domain/service'

@Resolver(() => EntityObject)
export abstract class BaseGraphQLResolver<E extends DomainEntity, D> {
  constructor(
    protected readonly resource: RESOURCE,
    protected readonly domainService: DomainService,
    protected readonly entityService: DomainEntityService<E, D>,
    protected readonly authzService: AuthzService,
  ) {}

  @ResolveField('policies', () => PolicyObject)
  protected async getEntityPolicies(
    @Parent() entity: E,
    @GraphQLUser() authzUser: AuthzUser,
    @Args('constraint', { type: () => CONSTRAINT, nullable: true })
    constraint: CONSTRAINT,
    @Args('resource', { type: () => RESOURCE, nullable: true })
    resource: RESOURCE = this.resource,
  ) {
    if (!constraint) constraint = await this.getHighestConstraintForEntity(entity, authzUser)

    const userPermissions = this.authzService.getUserPoliciesForConstraint(authzUser, constraint)
    const resourcePolicies = userPermissions[resource]

    const customizedResourcePolicies = await this.customizeEntityPolicies(resourcePolicies, entity)

    return customizedResourcePolicies
  }

  public async createWithActionScopeConstraint(
    data: Partial<D>,
    user: AuthzUser,
    action: ACTION = ACTION.CREATE,
  ): Promise<E[]> {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.createWithConstraint(data, queryContext)
  }

  public async getOneWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ): Promise<E | null> {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.getOneWithConstraint(selector, queryContext)
  }

  public async getManyWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ): Promise<E[] | null> {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.getManyWithConstraint(selector, queryContext)
  }

  public async updateWithActionScopeConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthzUser,
    action: ACTION = ACTION.UPDATE,
  ): Promise<E | E[] | null> {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.updateWithConstraint(selector, newData, queryContext)
  }

  public async deleteWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.DELETE,
  ): Promise<DeleteResult> {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.domainService.team.buildTeamQueryContext(user, scopeConstraint)

    return this.entityService.deleteWithConstraint(selector, queryContext)
  }

  protected async customizeEntityPolicies(originalPolicies: ActionPolicies, _entity: E) {
    return originalPolicies
  }

  protected denyAllPolicies(originalPolicies: ActionPolicies) {
    return mapValues(originalPolicies, () => POLICY.DENY)
  }

  private async getHighestConstraintForEntity(entity: E, user: AuthzUser) {
    const queryContext = await this.domainService.team.buildTeamQueryContext(user)
    const constraint = await this.entityService.defineResourceHighestConstraint(
      entity,
      queryContext,
    )

    return constraint
  }
}
