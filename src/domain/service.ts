import { Logger } from '@nestjs/common'
import { uniq } from 'lodash'
import { DeleteResult, Repository } from 'typeorm'
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
    _selector: Partial<D>,
    _userCompanies: Array<CompanyDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserReadForCompany method')
  }

  async canUserReadForTeam(
    _selector: Partial<D>,
    _userTeams: Array<TeamDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserReadForTeam method')
  }

  async canUserReadForSelf(_selector: Partial<D>, _user: UserDTO): Promise<boolean> {
    throw new Error('You must implement canUserReadForSelf method')
  }

  async canUserUpdateForCompany(
    _selector: Partial<D>,
    _userCompanies: Array<CompanyDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserUpdateForCompany method')
  }

  async canUserUpdateForTeam(
    _selector: Partial<D>,
    _userTeams: Array<TeamDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserUpdateForTeam method')
  }

  async canUserUpdateForSelf(_selector: Partial<D>, _user: UserDTO): Promise<boolean> {
    throw new Error('You must implement canUserUpdateForSelf method')
  }

  async canUserDeleteForCompany(
    _selector: Partial<D>,
    _userCompanies: Array<CompanyDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserDeleteForCompany method')
  }

  async canUserDeleteForTeam(
    _selector: Partial<D>,
    _userTeams: Array<TeamDTO['id']>,
    _user: UserDTO,
  ): Promise<boolean> {
    throw new Error('You must implement canUserDeleteForTeam method')
  }

  async canUserDeleteForSelf(_selector: Partial<D>, _user: UserDTO): Promise<boolean> {
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

  async getOneByID(id: D['id']): Promise<E | null> {
    return this.repository.findOne(id)
  }

  async getOneByIDIfUserIsInCompany(id: D['id'], user: UserDTO): Promise<E | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const isUserAllowedToRead = await this.canUserReadForCompany(
      { id } as Partial<D>,
      userCompanies,
      user,
    )

    return isUserAllowedToRead ? this.getOneByID(id) : undefined
  }

  async getOneByIDIfUserIsInTeam(id: D['id'], user: UserDTO): Promise<E | null> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const isUserAllowedToRead = await this.canUserReadForTeam({ id } as Partial<D>, userTeams, user)

    return isUserAllowedToRead ? this.getOneByID(id) : undefined
  }

  async getOneByIDIfUserOwnsIt(id: D['id'], user: UserDTO): Promise<E | null> {
    const isUserAllowedToRead = await this.canUserReadForSelf({ id } as Partial<D>, user)

    return isUserAllowedToRead ? this.getOneByID(id) : undefined
  }

  //* **** UPDATE *****//
  async updateOneByID(id: D['id'], newData: QueryDeepPartialEntity<E>): Promise<E | null> {
    await this.repository.update(id, newData)

    return this.getOneByID(id)
  }

  async updateOneByIDIfUserIsInCompany(
    id: D['id'],
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const isUserAllowedToUpdate = await this.canUserUpdateForCompany(
      { id } as Partial<D>,
      userCompanies,
      user,
    )

    return isUserAllowedToUpdate ? this.updateOneByID(id, newData) : undefined
  }

  async updateOneByIDIfUserIsInTeam(
    id: D['id'],
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const isUserAllowedToUpdate = await this.canUserUpdateForTeam(
      { id } as Partial<D>,
      userTeams,
      user,
    )

    return isUserAllowedToUpdate ? this.updateOneByID(id, newData) : undefined
  }

  async updateOneByIDIfUserOwnsIt(
    id: D['id'],
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const isUserAllowedToUpdate = await this.canUserUpdateForSelf({ id } as Partial<D>, user)

    return isUserAllowedToUpdate ? this.updateOneByID(id, newData) : undefined
  }

  //* **** DELETE *****//
  async deleteOneByID(id: D['id']): Promise<DeleteResult> {
    return this.repository.delete(id)
  }

  async deleteOneByIDIfUserIsInCompany(id: D['id'], user: UserDTO): Promise<DeleteResult> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const isUserAllowedToDelete = await this.canUserDeleteForCompany(
      { id } as Partial<D>,
      userCompanies,
      user,
    )

    return isUserAllowedToDelete ? this.deleteOneByID(id) : undefined
  }

  async deleteOneByIDIfUserIsInTeam(id: D['id'], user: UserDTO): Promise<DeleteResult> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const isUserAllowedToDelete = await this.canUserDeleteForTeam(
      { id } as Partial<D>,
      userTeams,
      user,
    )

    return isUserAllowedToDelete ? this.deleteOneByID(id) : undefined
  }

  async deleteOneByIDIfUserOwnsIt(id: D['id'], user: UserDTO): Promise<DeleteResult> {
    const isUserAllowedToDelete = await this.canUserDeleteForSelf({ id } as Partial<D>, user)

    return isUserAllowedToDelete ? this.deleteOneByID(id) : undefined
  }
}

export default DomainEntityService
