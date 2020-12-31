import { Logger } from '@nestjs/common'
import { uniq } from 'lodash'
import { DeleteResult, FindConditions, SelectQueryBuilder } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import DomainEntityRepository, { SelectionQueryConstrain } from 'domain/repository'

import { CONSTRAINT } from './constants'
import { TeamDTO } from './team/dto'
import { DomainServiceContext, DomainServiceGetOptions } from './types'
import { UserDTO } from './user/dto'

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
    const availableSelectors = {
      [CONSTRAINT.ANY]: async () => this.create(data),
      [CONSTRAINT.COMPANY]: async () => this.createIfUserIsInCompany(data, user),
      [CONSTRAINT.TEAM]: async () => this.createIfUserIsInTeam(data, user),
      [CONSTRAINT.OWNS]: async () => this.createIfUserOwnsIt(data, user),
    }
    const constrainedSelector = availableSelectors[constraint]

    return constrainedSelector()
  }

  async createIfUserIsInCompany(_data: Partial<D>, _user: UserDTO): Promise<E[] | null> {
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

  async createIfUserIsInTeam(_data: Partial<D>, _user: UserDTO): Promise<E[] | null> {
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

  async createIfUserOwnsIt(_data: Partial<D>, _user: UserDTO): Promise<E[] | null> {
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
  async parseAllTeamsInUserCompanies(user: UserDTO): Promise<Array<TeamDTO['id']>> {
    const userTeams = await user.teams
    const userCompanies = uniq(userTeams.map((team) => team.id))
    // TODO
    // Fetch user root teams
    // Get all child team ids based in user root teams
    // Return those team ids

    return userCompanies
  }

  async parseUserTeams(user: UserDTO): Promise<Array<TeamDTO['id']>> {
    const userTeams = await user.teams
    const userTeamIDs = uniq(userTeams.map((team) => team.id))

    return userTeamIDs
  }

  //* **** CREATE *****//
  async create(data: Partial<D> | Array<Partial<D>>): Promise<E[]> {
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
    const userCompaniesTeams = await this.parseAllTeamsInUserCompanies(user)

    this.logger.debug({
      userCompaniesTeams,
      user,
      context,
      message: `Reduced companies for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(userCompaniesTeams)

    return this.get(selector, constrainQuery)
  }

  async getIfUserIsInTeam(selector: FindConditions<E>, user: UserDTO) {
    const userTeams = await this.parseUserTeams(user)

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
    const userCompaniesTeams = await this.parseAllTeamsInUserCompanies(user)

    this.logger.debug({
      userCompaniesTeams,
      user,
      message: `Reduced companies for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(userCompaniesTeams)
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
    const userTeams = await this.parseUserTeams(user)

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
    const userCompaniesTeams = await this.parseAllTeamsInUserCompanies(user)

    this.logger.debug({
      userCompaniesTeams,
      user,
      message: `Reduced companies for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(userCompaniesTeams)
    const selectionQuery = this.repository.createQueryBuilder().where(selector)
    const constrainedSelectionQuery = constrainQuery(selectionQuery)

    const allowedData = await constrainedSelectionQuery.getMany()
    if (allowedData.length === 0) return

    return this.delete(selector)
  }

  async deleteIfUserIsInTeam(selector: FindConditions<E>, user: UserDTO): Promise<DeleteResult> {
    const userTeams = await this.parseUserTeams(user)

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
