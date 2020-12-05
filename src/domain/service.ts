import { Logger } from '@nestjs/common'
import { uniq } from 'lodash'
import { DeleteResult, FindConditions, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

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

  constructor(public readonly repository: Repository<E>, public readonly loggerName: string) {
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

  async canUserReadForCompany(
    _selector: FindConditions<E>,
    _userCompanies: Array<CompanyDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserReadForCompany method')
  }

  async canUserReadForTeam(
    _selector: FindConditions<E>,
    _userTeams: Array<TeamDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserReadForTeam method')
  }

  async canUserReadForSelf(_selector: FindConditions<E>, _user: UserDTO): Promise<boolean> {
    throw new Error('You must implement canUserReadForSelf method')
  }

  async canUserUpdateForCompany(
    _selector: FindConditions<E>,
    _userCompanies: Array<CompanyDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserUpdateForCompany method')
  }

  async canUserUpdateForTeam(
    _selector: FindConditions<E>,
    _userTeams: Array<TeamDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserUpdateForTeam method')
  }

  async canUserUpdateForSelf(_selector: FindConditions<E>, _user: UserDTO): Promise<boolean> {
    throw new Error('You must implement canUserUpdateForSelf method')
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

  async getOne(selector: FindConditions<E>): Promise<E | null> {
    return this.repository.findOne(selector)
  }

  async getOneIfUserIsInCompany(selector: FindConditions<E>, user: UserDTO): Promise<E | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const isUserAllowedToRead = await this.canUserReadForCompany(selector, userCompanies, user)

    return isUserAllowedToRead ? this.getOne(selector) : undefined
  }

  async getOneIfUserIsInTeam(selector: FindConditions<E>, user: UserDTO): Promise<E | null> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const isUserAllowedToRead = await this.canUserReadForTeam(selector, userTeams, user)

    return isUserAllowedToRead ? this.getOne(selector) : undefined
  }

  async getOneIfUserOwnsIt(selector: FindConditions<E>, user: UserDTO): Promise<E | null> {
    const isUserAllowedToRead = await this.canUserReadForSelf(selector, user)

    return isUserAllowedToRead ? this.getOne(selector) : undefined
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

    const isUserAllowedToUpdate = await this.canUserUpdateForCompany(selector, userCompanies, user)

    return isUserAllowedToUpdate ? this.update(selector, newData) : undefined
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

    const isUserAllowedToUpdate = await this.canUserUpdateForTeam(selector, userTeams, user)

    return isUserAllowedToUpdate ? this.update(selector, newData) : undefined
  }

  async updateIfUserOwnsIt(
    selector: FindConditions<E>,
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const isUserAllowedToUpdate = await this.canUserUpdateForSelf(selector, user)

    return isUserAllowedToUpdate ? this.update(selector, newData) : undefined
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
