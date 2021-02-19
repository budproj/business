import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { all as merge } from 'deepmerge'
import { fromPairs } from 'lodash'
import { DeleteResult, FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { ACTION, RESOURCE } from 'src/app/authz/constants'
import AuthzService from 'src/app/authz/service'
import { ActionPolicies, AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { PolicyObject } from 'src/app/graphql/authz/models'
import { CycleObject } from 'src/app/graphql/cycle/models'
import { EntityFiltersInput, EntityObject } from 'src/app/graphql/models'
import { TeamObject } from 'src/app/graphql/team/models'
import { CONSTRAINT } from 'src/domain/constants'
import { DomainEntity, DomainEntityService } from 'src/domain/entity'
import DomainService from 'src/domain/service'
import { Team } from 'src/domain/team/entities'

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
  ) => Promise<E | E[] | null>

  deleteWithActionScopeConstraint: (
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION,
  ) => Promise<DeleteResult>
}

export interface GraphQLEntityContext {
  filters?: EntityResolverFilters
}

export interface EntityResolverFilters extends EntityFiltersInput {
  teamsCycleID?: Record<TeamObject['id'], CycleObject['id']>
}

@Resolver(() => EntityObject)
abstract class GraphQLEntityResolver<
  E extends DomainEntity,
  D,
  F extends EntityResolverFilters = EntityResolverFilters
> implements GraphQLEntityResolverInterface<E, D> {
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

  protected async customizeEntityPolicies(originalPolicies: ActionPolicies, _entity: E) {
    return originalPolicies
  }

  protected async buildTeamsFilters(teams: Team | Team[], filters?: F) {
    const teamsCycleIDPairs = Array.isArray(teams)
      ? await this.getClosestCycleIDFromTeamList(teams)
      : undefined
    const teamsCycleID = fromPairs<CycleObject['id']>(teamsCycleIDPairs)

    const newFilters: F = {
      ...filters,
      teamsCycleID,
    }
    const resolverFilters = merge<F>([filters ?? {}, newFilters])

    return resolverFilters
  }

  protected parseTeamCycleFilter(team: TeamObject, filters: F) {
    return filters.cycleID ?? filters.teamsCycleID?.[team.id]
  }

  private async getClosestCycleIDForTeam(team: Team) {
    const closestCycle = await this.domainService.cycle.getClosestToEndFromTeam(team)

    return closestCycle?.id
  }

  private async getClosestCycleIDFromTeamList(teams: Team[]) {
    const teamsClosestCycleIDPromises = teams.map(async (team) =>
      Promise.all([team.id, this.getClosestCycleIDForTeam(team)]),
    )
    const teamsClosestCycleID = await Promise.all(teamsClosestCycleIDPromises)

    return teamsClosestCycleID
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

export default GraphQLEntityResolver
