import { Logger } from '@nestjs/common'
import { uniq } from 'lodash'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { Company, CompanyDTO } from './company'
import { Cycle, CycleDTO } from './cycle'
import { KeyResult, KeyResultDTO } from './key-result'
import { ConfidenceReport, ConfidenceReportDTO } from './key-result/report/confidence'
import { ProgressReport, ProgressReportDTO } from './key-result/report/progress'
import { Objective, ObjectiveDTO } from './objective'
import DomainRepository from './repository'
import { Team, TeamDTO } from './team'
import { User, UserDTO } from './user'
import { KeyResultView, KeyResultViewDTO } from './user/view/key-result'

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
    public readonly repository: DomainRepository<E, D>,
    public readonly loggerName: string,
  ) {
    this.logger = new Logger(loggerName ?? DomainEntityService.name)
  }

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

    const data = await this.repository.findByIDWithCompanyConstraint(id, userCompanies)

    return data
  }

  async getOneByIDIfUserIsInTeam(id: D['id'], user: UserDTO): Promise<E | null> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const data = await this.repository.findByIDWithTeamConstraint(id, userTeams)

    return data
  }

  async getOneByIDIfUserOwnsIt(id: D['id'], user: UserDTO): Promise<E | null> {
    const data = await this.repository.findByIDWithOwnsConstraint(id, user.id)

    return data
  }

  async getAll(): Promise<E[]> {
    return this.repository.find()
  }

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

    const data = await this.repository.updateByIDWithCompanyConstraint(id, newData, userCompanies)

    return data
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

    const data = await this.repository.updateByIDWithTeamConstraint(id, newData, userTeams)

    return data
  }

  async updateOneByIDIfUserOwnsIt(
    id: D['id'],
    newData: QueryDeepPartialEntity<E>,
    user: UserDTO,
  ): Promise<E | null> {
    const data = await this.repository.updateByIDWithOwnsConstraint(id, newData, user.id)

    return data
  }
}

export default DomainEntityService
