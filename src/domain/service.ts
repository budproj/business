import { Injectable, Logger } from '@nestjs/common'
import { DeleteResult, FindConditions, SelectQueryBuilder } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import DomainEntityRepository, { SelectionQueryConstrain } from 'domain/repository'

import { CONSTRAINT } from './constants'
import { TeamDTO } from './team/dto'
import { DomainServiceContext, DomainServiceGetOptions } from './types'
import { UserDTO } from './user/dto'

@Injectable()
abstract class DomainEntityService<E, D> {
  public readonly logger: Logger

  constructor(
    public readonly repository: DomainEntityRepository<E>,
    public readonly loggerName: string,
  ) {
    this.logger = new Logger(loggerName ?? DomainEntityService.name)
  }

  //* **** ABSTRACT METHODS *****//
  async createWithConstraint(constraint: CONSTRAINT, data: Partial<D>, user: UserDTO) {
    const context: DomainServiceContext = {
      user,
      constraint,
    }

    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.create(data, context),
      [CONSTRAINT.COMPANY]: async () => this.createIfUserIsInCompany(data, user, context),
      [CONSTRAINT.TEAM]: async () => this.createIfUserIsInTeam(data, user, context),
      [CONSTRAINT.OWNS]: async () => this.createIfUserOwnsIt(data, user, context),
    }
    const constrainedSelector = availableSelectors[constraint]

    return constrainedSelector()
  }

  async createIfUserIsInCompany(
    _data: Partial<D>,
    _user: UserDTO,
    _context?: DomainServiceContext,
  ): Promise<E[] | null> {
    // Since creation does not have a selector, we can not apply our constraint structure to it.
    // To solve it, each entity service must implement its own method that will decide if the user
    // is allowed to create that given resource.
    //
    // The suggested implementation is the following:
    // 1. You fetch the user teams or companies (you can check other constraint methods and copy their implementation)
    // 2. You run a read query for a given resource using a constraint (usually you will run a query from a different domain seervice)
    // 3. You evaluate if the user is allowed to create the resource (usually by checking if something returned from the query)
    // 4. You run the `this.create` method, by passing the provided data
    throw new Error('You need to implement the createIfUserIsInCompany method')
  }

  async createIfUserIsInTeam(
    _data: Partial<D>,
    _user: UserDTO,
    _context?: DomainServiceContext,
  ): Promise<E[] | null> {
    // Since creation does not have a selector, we can not apply our constraint structure to it.
    // To solve it, each entity service must implement its own method that will decide if the user
    // is allowed to create that given resource.
    //
    // The suggested implementation is the following:
    // 1. You fetch the user teams or companies (you can check other constraint methods and copy their implementation)
    // 2. You run a read query for a given resource using a constraint (usually you will run a query from a different domain seervice)
    // 3. You evaluate if the user is allowed to create the resource (usually by checking if something returned from the query)
    // 4. You run the `this.create` method, by passing the provided data
    throw new Error('You need to implement the createIfUserIsInTeam method')
  }

  async createIfUserOwnsIt(
    _data: Partial<D>,
    _user: UserDTO,
    _context?: DomainServiceContext,
  ): Promise<E[] | null> {
    // Since creation does not have a selector, we can not apply our constraint structure to it.
    // To solve it, each entity service must implement its own method that will decide if the user
    // is allowed to create that given resource.
    //
    // The suggested implementation is the following:
    // 1. You parse user data
    // 2. You run a read query for a given resource using a constraint (usually you will run a query from a different domain seervice)
    // 3. You evaluate if the user is allowed to create the resource (usually by checking if something returned from the query)
    // 4. You run the `this.create` method, by passing the provided data
    throw new Error('You need to implement the createIfUserIsOwnsIt method')
  }

  //* **** HELPERS *****//
  async parseUserCompanyIDs(_user: UserDTO): Promise<Array<TeamDTO['id']>> {
    // To constrain our queries to the user company, we need to parse them and find all root teams (a.k.a companies).
    // To do so, we need to use the teamService, which is a child class of DomainService. Because of that, adding the teamService call in this level would create a circular dependecy.
    // You need to implement that class in your inherited service. You can simply copy/paste the following code:
    //
    //
    // const userCompanies = await this.teamService.getUserRootTeams(user)
    // const userCompanyIDs = uniq(userCompanies.map((company) => company.id))
    //
    // return userCompanyIDs
    throw new Error('You need to implement the parseUserCompanyIDs method')
  }

  async parseUserCompaniesTeamIDs(
    _companyIDs: Array<TeamDTO['id']>,
  ): Promise<Array<TeamDTO['id']>> {
    // To constrain our queries to the user company, we need to parse them and find all teams inside user companies.
    // To do so, we need to use the teamService, which is a child class of DomainService. Because of that, adding the teamService call in this level would create a circular dependecy.
    // You need to implement that class in your inherited service. You can simply copy/paste the following code:
    //
    //
    // const companiesTeams = await this.teamService.getAllTeamsBelowNodes(companyIDs)
    // const companiesTeamIDs = uniq(companiesTeams.map((team) => team.id))
    //
    // return companiesTeamIDs
    throw new Error('You need to implement the parseUserCompaniesTeamIDs method')
  }

  async parseUserTeamIDs(user: UserDTO) {
    const teams = await user.teams
    const teamIDs = teams.map((team) => team.id)

    return teamIDs
  }

  //* **** CREATE *****//
  async create(
    data: Partial<D> | Array<Partial<D>>,
    _context?: DomainServiceContext,
  ): Promise<E[]> {
    const result = await this.repository.insert(data as QueryDeepPartialEntity<E>)

    return result.raw
  }

  //* **** READ *****/
  async getOneWithConstraint(constraint: CONSTRAINT, selector: FindConditions<E>, user: UserDTO) {
    const query = await this.getWithConstraint(constraint, selector, user)
    const context: DomainServiceContext = {
      user,
      constraint,
    }

    const data = this.getOneInQuery(query, context)

    return data
  }

  async getManyWithConstraint(constraint: CONSTRAINT, user: UserDTO, selector?: FindConditions<E>) {
    const query = await this.getWithConstraint(constraint, selector, user)
    const context: DomainServiceContext = {
      user,
      constraint,
    }

    const data = this.getManyInQuery(query, context)

    return data
  }

  async getWithConstraint(constraint: CONSTRAINT, selector: FindConditions<E>, user: UserDTO) {
    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.get(selector),
      [CONSTRAINT.COMPANY]: async () => this.getIfUserIsInCompany(selector, user),
      [CONSTRAINT.TEAM]: async () => this.getIfUserIsInTeam(selector, user),
      [CONSTRAINT.OWNS]: async () => this.getIfUserOwnsIt(selector, user),
    }
    const constrainedSelector = availableSelectors[constraint]

    return constrainedSelector()
  }

  get(
    selector: FindConditions<E>,
    constrainQuery?: SelectionQueryConstrain<E>,
    options?: DomainServiceGetOptions,
  ) {
    const query = this.repository
      .createQueryBuilder()
      .where(selector)
      .take(options?.limit ?? 0)

    return constrainQuery ? constrainQuery(query) : query
  }

  async getIfUserIsInCompany(
    selector: FindConditions<E>,
    user: UserDTO,
    context?: DomainServiceContext,
  ) {
    const companyIDs = await this.parseUserCompanyIDs(user)
    const companiesTeamIDs = await this.parseUserCompaniesTeamIDs(companyIDs)

    this.logger.debug({
      companyIDs,
      companiesTeamIDs,
      user,
      context,
      message: `Reduced companies and companies teams for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(companiesTeamIDs)

    return this.get(selector, constrainQuery)
  }

  async getIfUserIsInTeam(selector: FindConditions<E>, user: UserDTO) {
    const userTeams = await this.parseUserTeamIDs(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const constrainQuery = this.repository.constraintQueryToTeam(userTeams)

    return this.get(selector, constrainQuery)
  }

  async getIfUserOwnsIt(selector: FindConditions<E>, user: UserDTO) {
    const constrainQuery = this.repository.constraintQueryToOwns(user)

    return this.get(selector, constrainQuery)
  }

  async getOneInQuery(query: SelectQueryBuilder<E>, serviceContext?: DomainServiceContext) {
    this.logger.debug({
      serviceContext,
      message: `Getting one for request`,
    })

    return query.getOne()
  }

  async getManyInQuery(query: SelectQueryBuilder<E>, serviceContext?: DomainServiceContext) {
    this.logger.debug({
      serviceContext,
      message: `Getting many for request`,
    })

    return query.getMany()
  }

  async getOne(selector: FindConditions<E>, options?: DomainServiceGetOptions) {
    const query = this.get(selector, undefined, options)

    return query.getOne()
  }

  async getMany(selector: FindConditions<E>, options?: DomainServiceGetOptions) {
    const query = this.get(selector, undefined, options)

    return query.getMany()
  }

  //* **** UPDATE *****//
  async update(selector: FindConditions<E>, newData: QueryDeepPartialEntity<E>): Promise<E | null> {
    await this.repository.update(selector, newData)

    return this.getOne(selector)
  }

  async updateWithConstraint(
    constraint: CONSTRAINT,
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ) {
    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.update(selector, newData),
      [CONSTRAINT.COMPANY]: async () => this.updateIfUserIsInCompany(selector, newData, user),
      [CONSTRAINT.TEAM]: async () => this.updateIfUserIsInTeam(selector, newData, user),
      [CONSTRAINT.OWNS]: async () => this.updateIfUserOwnsIt(selector, newData, user),
    }
    const constrainedSelector = availableSelectors[constraint]

    return constrainedSelector()
  }

  async updateIfUserIsInCompany(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const companyIDs = await this.parseUserCompanyIDs(user)
    const companiesTeamIDs = await this.parseUserCompaniesTeamIDs(companyIDs)

    this.logger.debug({
      companyIDs,
      companiesTeamIDs,
      user,
      message: `Reduced companies and companies teams for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(companiesTeamIDs)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.update(selector, newData)
  }

  async updateIfUserIsInTeam(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const userTeams = await this.parseUserTeamIDs(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const constrainQuery = this.repository.constraintQueryToTeam(userTeams)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.update(selector, newData)
  }

  async updateIfUserOwnsIt(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const constrainQuery = this.repository.constraintQueryToOwns(user)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.update(selector, newData)
  }

  //* **** DELETE *****//
  async delete(selector: FindConditions<E>): Promise<DeleteResult> {
    return this.repository.delete(selector)
  }

  async deleteWithConstraint(constraint: CONSTRAINT, selector: FindConditions<E>, user: UserDTO) {
    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.delete(selector),
      [CONSTRAINT.COMPANY]: async () => this.deleteIfUserIsInCompany(selector, user),
      [CONSTRAINT.TEAM]: async () => this.deleteIfUserIsInTeam(selector, user),
      [CONSTRAINT.OWNS]: async () => this.deleteIfUserOwnsIt(selector, user),
    }
    const constrainedSelector = availableSelectors[constraint]

    return constrainedSelector()
  }

  async deleteIfUserIsInCompany(selector: FindConditions<E>, user: UserDTO): Promise<DeleteResult> {
    const companyIDs = await this.parseUserCompanyIDs(user)
    const companiesTeamIDs = await this.parseUserCompaniesTeamIDs(companyIDs)

    this.logger.debug({
      companyIDs,
      companiesTeamIDs,
      user,
      message: `Reduced companies and companies teams for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(companiesTeamIDs)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.delete(selector)
  }

  async deleteIfUserIsInTeam(selector: FindConditions<E>, user: UserDTO): Promise<DeleteResult> {
    const userTeams = await this.parseUserTeamIDs(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const constrainQuery = this.repository.constraintQueryToTeam(userTeams)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.delete(selector)
  }

  async deleteIfUserOwnsIt(selector: FindConditions<E>, user: UserDTO): Promise<DeleteResult> {
    const constrainQuery = this.repository.constraintQueryToOwns(user)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.delete(selector)
  }
}

export default DomainEntityService
