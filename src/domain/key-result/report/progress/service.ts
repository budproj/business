import { forwardRef, Inject, Injectable, Scope } from '@nestjs/common'
import { remove, uniq } from 'lodash'
import { LessThanOrEqual } from 'typeorm'

import { CONSTRAINT } from 'src/domain/constants'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { ProgressReportDTO } from 'src/domain/key-result/report/progress/dto'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainEntityService from 'src/domain/service'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'
import { UserDTO } from 'src/domain/user/dto'

import { ProgressReport } from './entities'
import DomainProgressReportRepository from './repository'

@Injectable({ scope: Scope.REQUEST })
class DomainProgressReportService extends DomainEntityService<ProgressReport, ProgressReportDTO> {
  public snapshotDate: Date

  constructor(
    public readonly repository: DomainProgressReportRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
    @Inject(forwardRef(() => DomainTeamService))
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainProgressReportService.name)
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
  ): Promise<ProgressReport[]> {
    return this.repository.find({
      where: { keyResultId },
      order: { createdAt: 'DESC' },
      take: options?.limit ?? 0,
    })
  }

  async getFromUser(userId: UserDTO['id']): Promise<ProgressReport[]> {
    return this.repository.find({ userId })
  }

  async getFromUsers(userIDs: Array<UserDTO['id']>) {
    return this.repository.selectManyInUserIDs(userIDs)
  }

  async getLatestFromKeyResult(keyResultID: KeyResultDTO['id']) {
    const date = new Date()
    const progress = await this.getLatestFromDateForKeyResult(keyResultID, date)

    return progress
  }

  async getLatestFromSnapshotForKeyResult(keyResultID: KeyResultDTO['id']) {
    const progress = await this.getLatestFromDateForKeyResult(keyResultID, this.snapshotDate)

    return progress
  }

  async getLatestFromDateForKeyResult(keyResultId: KeyResultDTO['id'], date: Date) {
    const isoDate = date.toISOString()
    const progress = await this.repository.findOne({
      where: { keyResultId, createdAt: LessThanOrEqual(isoDate) },
      order: { createdAt: 'DESC' },
    })

    return progress
  }

  async buildProgressReports(
    progressReports: Partial<ProgressReportDTO> | Array<Partial<ProgressReportDTO>>,
  ): Promise<Array<Partial<ProgressReportDTO>>> {
    const normalizedReportPromises = Array.isArray(progressReports)
      ? progressReports.map(async (progressReport) => this.normalizeReport(progressReport))
      : [this.normalizeReport(progressReports)]
    const normalizedReports = remove(await Promise.all(normalizedReportPromises))

    return normalizedReports
  }

  async create(
    rawProgressReports: Partial<ProgressReportDTO> | Array<Partial<ProgressReportDTO>>,
  ): Promise<ProgressReport[]> {
    const progressReports = await this.buildProgressReports(rawProgressReports)

    this.logger.debug({
      progressReports,
      message: 'Creating new progress report',
    })

    const data = await this.repository.insert(progressReports)
    const createdProgressReports = data.raw

    return createdProgressReports
  }

  async enhanceWithPreviousValue(
    progressReport: Partial<ProgressReportDTO>,
  ): Promise<Partial<ProgressReportDTO | undefined>> {
    const latestProgressReport = await this.getLatestFromKeyResult(progressReport.keyResultId)
    const enhancedProgressReport = {
      ...progressReport,
      valuePrevious: latestProgressReport?.valueNew,
    }

    this.logger.debug({
      progressReport,
      enhancedProgressReport,
      latestProgressReport,
      message: 'Enhancing progress report with latest report value',
    })

    return enhancedProgressReport
  }

  async createIfUserIsInCompany(
    data: Partial<ProgressReport>,
    user: UserDTO,
  ): Promise<ProgressReport[] | null> {
    const selector = { id: data.keyResultId }
    const keyResult = await this.keyResultService.getOneWithConstraint(
      CONSTRAINT.COMPANY,
      selector,
      user,
    )
    if (!keyResult) return

    return this.create(data)
  }

  async createIfUserIsInTeam(
    data: Partial<ProgressReport>,
    user: UserDTO,
  ): Promise<ProgressReport[] | null> {
    const selector = { id: data.keyResultId }
    const keyResult = await this.keyResultService.getOneWithConstraint(
      CONSTRAINT.TEAM,
      selector,
      user,
    )
    if (!keyResult) return

    return this.create(data)
  }

  async createIfUserOwnsIt(
    data: Partial<ProgressReport>,
    user: UserDTO,
  ): Promise<ProgressReport[] | null> {
    const selector = { id: data.keyResultId }
    const keyResult = await this.keyResultService.getOneWithConstraint(
      CONSTRAINT.OWNS,
      selector,
      user,
    )
    if (!keyResult) return

    return this.create(data)
  }

  async normalizeReport(confidenceReport: Partial<ProgressReportDTO>) {
    const enhancedWithPreviousValue = await this.enhanceWithPreviousValue(confidenceReport)
    const ensuredNewValue = await this.ensureNewValue(enhancedWithPreviousValue)

    return ensuredNewValue
  }

  async ensureNewValue(confidenceReport: Partial<ProgressReportDTO>) {
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

export default DomainProgressReportService
