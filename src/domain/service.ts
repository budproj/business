import { Logger } from '@nestjs/common'
import { uniq } from 'lodash'
import { DeleteResult, FindConditions } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import DomainEntityRepository, { SelectionQueryConstrain } from 'domain/repository'

import { CompanyDTO } from './company/dto'
import { Company } from './company/entities'
import { CycleDTO } from './cycle/dto'
import { Cycle } from './cycle/entities'
import { KeyResultDTO } from './key-result/dto'
import { KeyResult } from './key-result/entities'
import { ConfidenceReportDTO } from './key-result/report/confidence/dto'
import { ConfidenceReport } from './key-result/report/confidence/entities'
import { ProgressReportDTO } from './key-result/report/progress/dto'
import { ProgressReport } from './key-result/report/progress/entities'
import { ObjectiveDTO } from './objective/dto'
import { Objective } from './objective/entities'
import { TeamDTO } from './team/dto'
import { Team } from './team/entities'
import { UserDTO } from './user/dto'
import { User } from './user/entities'
import { KeyResultViewDTO } from './user/view/key-result/dto'
import { KeyResultView } from './user/view/key-result/entities'

abstract class DomainEntityService<
  E extends
    | User
    | KeyResultView
    | Team
    | Objective
    | KeyResult
    | ProgressReport
    | ConfidenceReport
    | Cycle
    | Company,
  D extends
    | UserDTO
    | KeyResultViewDTO
    | TeamDTO
    | ObjectiveDTO
    | KeyResultDTO
    | ProgressReportDTO
    | ConfidenceReportDTO
    | CycleDTO
    | CompanyDTO
> {
  public readonly logger: Logger

  constructor(
    public readonly repository: DomainEntityRepository<E>,
    public readonly loggerName: string,
  ) {
    this.logger = new Logger(loggerName ?? DomainEntityService.name)
  }

  //* **** ABSTRACT PERMISSION HANDLERS *****//
  async canUserCreateForCompany(
    _selector: Partial<D>,
    _userCompanies: Array<CompanyDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserCreateForCompany method')
  }

  async canUserCreateForTeam(
    _selector: Partial<D>,
    _userTeams: Array<TeamDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserCreateForTeam method')
  }

  async canUserCreateForSelf(_selector: Partial<D>, _user: UserDTO): Promise<boolean> {
    throw new Error('You must implement canUserCreateForSelf method')
  }

  async canUserDeleteForCompany(
    _selector: FindConditions<E>,
    _userCompanies: Array<CompanyDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserDeleteForCompany method')
  }

  async canUserDeleteForTeam(
    _selector: FindConditions<E>,
    _userTeams: Array<TeamDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserDeleteForTeam method')
  }

  async canUserDeleteForSelf(_selector: FindConditions<E>, _user: UserDTO): Promise<boolean> {
    throw new Error('You must implement canUserDeleteForSelf method')
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

  async createIfUserIsInCompany(data: Partial<D>, user: UserDTO): Promise<E[] | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const isUserAllowedToCreate = await this.canUserCreateForCompany(data, userCompanies, user)

    return isUserAllowedToCreate ? this.create(data) : undefined
  }

  async createIfUserIsInTeam(data: Partial<D>, user: UserDTO): Promise<E[] | null> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const isUserAllowedToCreate = await this.canUserCreateForTeam(data, userTeams, user)

    return isUserAllowedToCreate ? this.create(data) : undefined
  }

  async createIfUserOwnsIt(data: Partial<D>, user: UserDTO): Promise<E[] | null> {
    const isUserAllowedToCreate = await this.canUserCreateForSelf(data, user)

    return isUserAllowedToCreate ? this.create(data) : undefined
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

    const isUserAllowedToDelete = await this.canUserDeleteForCompany(selector, userCompanies, user)

    return isUserAllowedToDelete ? this.delete(selector) : undefined
  }

  async deleteIfUserIsInTeam(selector: FindConditions<E>, user: UserDTO): Promise<DeleteResult> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const isUserAllowedToDelete = await this.canUserDeleteForTeam(selector, userTeams, user)

    return isUserAllowedToDelete ? this.delete(selector) : undefined
  }

  async deleteIfUserOwnsIt(selector: FindConditions<E>, user: UserDTO): Promise<DeleteResult> {
    const isUserAllowedToDelete = await this.canUserDeleteForSelf(selector, user)

    return isUserAllowedToDelete ? this.delete(selector) : undefined
  }
}

export default DomainEntityService
