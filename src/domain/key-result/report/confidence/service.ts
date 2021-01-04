import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { remove, uniq } from 'lodash'

import { KeyResultDTO } from 'domain/key-result/dto'
import { ConfidenceReportDTO } from 'domain/key-result/report/confidence/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import DomainTeamService from 'domain/team/service'
import { UserDTO } from 'domain/user/dto'

import { ConfidenceReport } from './entities'
import DomainConfidenceReportRepository from './repository'

@Injectable()
class DomainConfidenceReportService extends DomainEntityService<
  ConfidenceReport,
  ConfidenceReportDTO
> {
  constructor(
    public readonly repository: DomainConfidenceReportRepository,
    @Inject(forwardRef(() => DomainTeamService))
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainConfidenceReportService.name)
  }

  async parseUserCompanyIDs(user: UserDTO) {
    const userCompanies = await this.teamService.getUserRootTeams(user)
    const userCompanyIDs = uniq(userCompanies.map((company) => company.id))

    return userCompanyIDs
  }

  async parseUserCompaniesTeamIDs(companyIDs: Array<TeamDTO['id']>) {
    const companiesTeams = await this.teamService.getAllTeamsBelowNodes(companyIDs)
    const companiesTeamIDs = uniq(companiesTeams.map((team) => team.id))

    return companiesTeamIDs
  }

  async getFromKeyResult(
    keyResultId: KeyResultDTO['id'],
    options?: { limit?: number },
  ): Promise<ConfidenceReport[]> {
    return this.repository.find({
      where: { keyResultId },
      order: { createdAt: 'DESC' },
      take: options?.limit ?? 0,
    })
  }

  async getFromUser(userId: UserDTO['id']): Promise<ConfidenceReport[]> {
    return this.repository.find({ userId })
  }

  async getFromUsers(userIDs: Array<UserDTO['id']>) {
    return this.repository.selectManyInUserIDs(userIDs)
  }

  async getLatestFromKeyResult(keyResultId: KeyResultDTO['id']): Promise<ConfidenceReport> {
    return this.repository.findOne({ where: { keyResultId }, order: { createdAt: 'DESC' } })
  }

  async buildConfidenceReports(
    confidenceReports: Partial<ConfidenceReportDTO> | Array<Partial<ConfidenceReportDTO>>,
  ): Promise<Array<Partial<ConfidenceReportDTO>>> {
    const enhancementPromises = Array.isArray(confidenceReports)
      ? confidenceReports.map(this.enhanceWithPreviousValue)
      : [this.enhanceWithPreviousValue(confidenceReports)]
    const confidenceReportsWithPreviousValues = remove(await Promise.all(enhancementPromises))

    return confidenceReportsWithPreviousValues
  }

  async create(
    rawConfidenceReports: Partial<ConfidenceReportDTO> | Array<Partial<ConfidenceReportDTO>>,
  ): Promise<ConfidenceReport[]> {
    const confidenceReports = await this.buildConfidenceReports(rawConfidenceReports)

    this.logger.debug({
      confidenceReports,
      message: 'Creating new confidence report',
    })

    const data = await this.repository.insert(confidenceReports)
    const createdConfidenceReports = data.raw

    return createdConfidenceReports
  }

  async enhanceWithPreviousValue(
    confidenceReport: Partial<ConfidenceReportDTO>,
  ): Promise<Partial<ConfidenceReportDTO | undefined>> {
    const latestConfidenceReport = await this.getLatestFromKeyResult(confidenceReport.keyResultId)
    const enhancedConfidenceReport = {
      ...confidenceReport,
      valuePrevious: latestConfidenceReport?.valueNew,
    }

    this.logger.debug({
      confidenceReport,
      enhancedConfidenceReport,
      latestConfidenceReport,
      message: 'Enhancing confidence report with latest report value',
    })

    if (enhancedConfidenceReport.valuePrevious === enhancedConfidenceReport.valueNew) return
    return enhancedConfidenceReport
  }
}

export default DomainConfidenceReportService
