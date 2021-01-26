import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { remove, uniq } from 'lodash'

import { KeyResultDTO } from 'src/domain/key-result/dto'
import { ConfidenceReportDTO } from 'src/domain/key-result/report/confidence/dto'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainEntityService from 'src/domain/service'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'
import { UserDTO } from 'src/domain/user/dto'

import { ConfidenceReport } from './entities'
import DomainConfidenceReportRepository from './repository'

@Injectable()
class DomainConfidenceReportService extends DomainEntityService<
  ConfidenceReport,
  ConfidenceReportDTO
> {
  constructor(
    public readonly repository: DomainConfidenceReportRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
    @Inject(forwardRef(() => DomainTeamService))
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainConfidenceReportService.name)
  }

  async parseUserCompanyIDs(user: UserDTO) {
    const userCompanies = await this.teamService.getUserCompanies(user)
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
    const normalizedReportPromises = Array.isArray(confidenceReports)
      ? confidenceReports.map(async (confidenceReport) => this.normalizeReport(confidenceReport))
      : [this.normalizeReport(confidenceReports)]
    const normalizedReports = remove(await Promise.all(normalizedReportPromises))

    return normalizedReports
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

  async normalizeReport(confidenceReport: Partial<ConfidenceReportDTO>) {
    const enhancedWithPreviousValue = await this.enhanceWithPreviousValue(confidenceReport)
    const ensuredNewValue = await this.ensureNewValue(enhancedWithPreviousValue)

    return ensuredNewValue
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

    return enhancedConfidenceReport
  }

  async ensureNewValue(confidenceReport: Partial<ConfidenceReportDTO>) {
    if (confidenceReport.valueNew) return confidenceReport

    const previousValue =
      confidenceReport.valuePrevious ??
      (await this.keyResultService.getInitialValue(confidenceReport.keyResultId))

    return {
      ...confidenceReport,
      valueNew: previousValue,
    }
  }
}

export default DomainConfidenceReportService
