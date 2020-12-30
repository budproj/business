import { Injectable } from '@nestjs/common'
import { startOfWeek } from 'date-fns'
import { flatten, isEqual, orderBy, uniqWith } from 'lodash'

import { CompanyDTO } from 'domain/company/dto'
import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import DomainKeyResultService from 'domain/key-result/service'
import DomainEntityService from 'domain/service'
import DomainTeamService from 'domain/team/service'
import { UserDTO } from 'domain/user/dto'

import { Company } from './entities'
import DomainCompanyRepository from './repository'

@Injectable()
class DomainCompanyService extends DomainEntityService<Company, CompanyDTO> {
  constructor(
    public readonly repository: DomainCompanyRepository,
    private readonly keyResultService: DomainKeyResultService,
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainCompanyService.name)
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Company[]> {
    return this.repository.find({ ownerId })
  }

  async getCurrentProgress(companyID: CompanyDTO['id']) {
    const date = new Date()
    const currentProgress = await this.getProgressAtDate(date, companyID)

    return currentProgress
  }

  async getLastWeekProgress(companyID: CompanyDTO['id']) {
    const date = new Date()
    const startOfWeekDate = startOfWeek(date)
    const currentProgress = await this.getProgressAtDate(startOfWeekDate, companyID)

    return currentProgress
  }

  async getProgressAtDate(date: Date, companyID: CompanyDTO['id']) {
    const childTeams = await this.teamService.getFromCompany(companyID, ['id'])
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const keyResults = await this.keyResultService.getFromTeam(childTeamIds)
    if (!keyResults) return

    const previousSnapshotDate = this.keyResultService.report.progress.snapshotDate
    this.keyResultService.report.progress.snapshotDate = date

    const companyProgress = this.keyResultService.calculateAverageCurrentProgressFromList(
      keyResults,
    )

    this.keyResultService.report.progress.snapshotDate = previousSnapshotDate

    return companyProgress
  }

  async getCurrentConfidence(companyId: CompanyDTO['id']): Promise<ConfidenceReport['valueNew']> {
    const childTeams = await this.teamService.getFromCompany(companyId, ['id'])
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const keyResults = await this.keyResultService.getFromTeam(childTeamIds)
    if (!keyResults) return

    const companyCurrentConfidence = this.keyResultService.calculateAverageCurrentConfidenceFromList(
      keyResults,
    )

    return companyCurrentConfidence
  }

  async getUsersInCompany(companyId: CompanyDTO['id']): Promise<UserDTO[]> {
    const childTeams = await this.teamService.getFromCompany(companyId, ['id'])
    const childTeamsUsers = await Promise.all(
      childTeams.map(async (team) => this.teamService.getUsersInTeam(team.id)),
    )

    const companyUsers = flatten(childTeamsUsers)
    const uniqCompanyUsers = uniqWith(companyUsers, isEqual)

    return uniqCompanyUsers
  }

  async getFromIDs(companyIDs: Array<CompanyDTO['id']>, options?: { limit?: number }) {
    const companies = this.repository.selectManyInIDs(companyIDs, options)

    return companies
  }

  async getCompanyUserIDs(companyID: CompanyDTO['id']) {
    const users = await this.getUsersInCompany(companyID)
    const userIDs = users.map((user) => user.id)

    return userIDs
  }

  async getLatestReport(companyID: CompanyDTO['id']) {
    const userIDs = await this.getCompanyUserIDs(companyID)
    const reports = await this.keyResultService.report.getFromUsers(userIDs)
    const orderedReports = orderBy(reports, ['createdAt'], ['desc'])

    const latestReport = orderedReports[0]

    return latestReport
  }

  async getPercentageProgressIncrease(companyID: CompanyDTO['id']) {
    const currentProgress = await this.getCurrentProgress(companyID)
    const lastWeekProgress = await this.getLastWeekProgress(companyID)

    const deltaProgress = currentProgress - lastWeekProgress

    return deltaProgress
  }
}

export default DomainCompanyService
