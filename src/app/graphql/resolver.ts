import { mapValues, uniq } from 'lodash'
import { DeleteResult, FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { ACTION, RESOURCE } from 'src/app/authz/constants'
import { AuthzUser } from 'src/app/authz/types'
import { USER_POLICY } from 'src/app/graphql/user/constants'
import { UserActionPolicies } from 'src/app/graphql/user/types'
import { DomainEntityService } from 'src/domain/entity'
import DomainTeamService from 'src/domain/team/service'
import { TeamDTO } from 'src/domain/team/dto'
import { CONSTRAINT } from 'src/domain/constants'
import { Injectable } from '@nestjs/common'
import DomainService from 'src/domain/service'

export interface GraphQLEntityResolverInterface<E, D> {
  createWithActionScopeConstraint: (data: Partial<D>, user: AuthzUser, action: ACTION) => Promise<E>

  getOneWithActionScopeConstraint: (
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION,
  ) => Promise<E>
  getManyWithActionScopeConstraint: (
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION,
  ) => Promise<E[]>

  updateWithActionScopeConstraint: (
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthzUser,
    action: ACTION,
  ) => Promise<E>

  deleteWithActionScopeConstraint: (
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION,
  ) => Promise<DeleteResult>

  getUserPolicies: (selector: FindConditions<E>, user: AuthzUser) => Promise<UserActionPolicies>
}

abstract class GraphQLEntityResolver<E, D> implements GraphQLEntityResolverInterface<E, D> {
  constructor(
    protected readonly resource: RESOURCE,
    protected readonly domainService: DomainService,
    protected readonly entityService: DomainEntityService<E, D>,
  ) {}

  private async buildDomainQueryContext(user: AuthzUser, constraint: CONSTRAINT) {
    const context = this.entityService.buildContext(user, constraint)

    const userCompaniesIDs = await this.parseUserCompanyIDs(user)
    const userCompaniesTeamsIDs = await this.parseUserCompaniesTeamIDs(userCompaniesIDs)
    const userTeams = await this.parseUserTeamIDs(user)

    const query = {
      companies: userCompaniesIDs,
      teams: userCompaniesTeamsIDs,
      userTeams,
    }

    return {
      ...context,
      query,
    }
  }

  private async parseUserCompanyIDs(user: AuthzUser) {
    const userCompanies = await this.domainService.team.getUserRootTeams(user)
    const userCompanyIDs = uniq(userCompanies.map((company) => company.id))

    return userCompanyIDs
  }

  private async parseUserCompaniesTeamIDs(companyIDs: TeamDTO['id'][]) {
    const companiesTeams = await this.domainService.team.getAllTeamsBelowNodes(companyIDs)
    const companiesTeamIDs = uniq(companiesTeams.map((team) => team.id))

    return companiesTeamIDs
  }

  private async parseUserTeamIDs(user: AuthzUser) {
    const teams = await user.teams
    const teamIDs = teams.map((team) => team.id)

    return teamIDs
  }

  public async createWithActionScopeConstraint(
    data: Partial<D>,
    user: AuthzUser,
    action: ACTION = ACTION.CREATE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.buildDomainQueryContext(user, scopeConstraint)

    return this.entityService.createWithConstraint(data, queryContext)
  }

  public async getOneWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.buildDomainQueryContext(user, scopeConstraint)

    return this.entityService.getOneWithConstraint(selector, queryContext)
  }

  public async getManyWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.buildDomainQueryContext(user, scopeConstraint)

    return this.entityService.getManyWithConstraint(selector, queryContext)
  }

  public async updateWithActionScopeConstraint(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: AuthzUser,
    action: ACTION = ACTION.UPDATE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.buildDomainQueryContext(user, scopeConstraint)

    return this.entityService.updateWithConstraint(selector, newData, queryContext)
  }

  public async deleteWithActionScopeConstraint(
    selector: FindConditions<E>,
    user: AuthzUser,
    action: ACTION = ACTION.DELETE,
  ) {
    const scopeConstraint = user.scopes[this.resource][action]
    const queryContext = await this.buildDomainQueryContext(user, scopeConstraint)

    return this.entityService.deleteWithConstraint(selector, queryContext)
  }

  public async getUserPolicies(selector: FindConditions<E>, user: AuthzUser) {
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
        const foundData = await this.getOneWithActionScopeConstraint(selector, user)

        return foundData ? USER_POLICY.ALLOW : USER_POLICY.DENY
      },
    )

    return policies
  }
}

export default GraphQLEntityResolver
