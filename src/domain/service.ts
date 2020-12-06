import { Logger } from '@nestjs/common'
import { uniq } from 'lodash'
import { DeleteResult, FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import DomainEntityRepository, { SelectionQueryConstrain } from 'domain/repository'

import { CompanyDTO } from './company/dto'
import { TeamDTO } from './team/dto'
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
  async createIfUserIsInCompany(_data: Partial<D>, _user: UserDTO): Promise<E[] | null> {
    // Since creation does not have a selector, we can not apply our constraint structure to it.
    // To solve it, each entity service must implement its own method that will decide if the user
    // is allowed to create that given resource.
    //
    // The suggested implementation is the following:
    // 1. You fetch the user teams or companies (you can check other contraint methods and copy their implementation)
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
    // 1. You fetch the user teams or companies (you can check other contraint methods and copy their implementation)
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
  async parseUserCompanies(user: UserDTO): Promise<Array<CompanyDTO['id']>> {
    const userTeams = await user.teams
    const userCompanies = uniq(userTeams.map((team) => team.companyId))

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
  async getAll(): Promise<E[]> {
    return this.repository.find()
  }

  async getOne(
    selector: FindConditions<E>,
    constrainQuery?: SelectionQueryConstrain<E>,
  ): Promise<E | null> {
    const query = this.repository.createQueryBuilder().where(selector)

    return constrainQuery ? constrainQuery(query).getOne() : query.getOne()
  }

  async getOneIfUserIsInCompany(selector: FindConditions<E>, user: UserDTO): Promise<E | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(userCompanies)

    return this.getOne(selector, constrainQuery)
  }

  async getOneIfUserIsInTeam(selector: FindConditions<E>, user: UserDTO): Promise<E | null> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const constrainQuery = this.repository.constraintQueryToTeam(userTeams)

    return this.getOne(selector, constrainQuery)
  }

  async getOneIfUserOwnsIt(selector: FindConditions<E>, user: UserDTO): Promise<E | null> {
    const constrainQuery = this.repository.constraintQueryToOwns(user)

    return this.getOne(selector, constrainQuery)
  }

  //* **** UPDATE *****//
  async update(selector: FindConditions<E>, newData: QueryDeepPartialEntity<E>): Promise<E | null> {
    await this.repository.update(selector, newData)

    return this.getOne(selector)
  }

  async updateIfUserIsInCompany(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(userCompanies)
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

  async deleteIfUserIsInCompany(selector: FindConditions<E>, user: UserDTO): Promise<DeleteResult> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const constrainQuery = this.repository.constraintQueryToCompany(userCompanies)
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
