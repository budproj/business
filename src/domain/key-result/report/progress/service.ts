import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { remove } from 'lodash'

import { CONSTRAINT } from 'domain/constants'
import { KeyResultDTO } from 'domain/key-result/dto'
import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'
import DomainKeyResultService from 'domain/key-result/service'
import DomainEntityService from 'domain/service'
import { UserDTO } from 'domain/user/dto'
import { DuplicateEntityError } from 'errors'

import { ProgressReport } from './entities'
import DomainProgressReportRepository from './repository'

@Injectable()
class DomainProgressReportService extends DomainEntityService<ProgressReport, ProgressReportDTO> {
  constructor(
    public readonly repository: DomainProgressReportRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(repository, DomainProgressReportService.name)
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

  async getLatestFromKeyResult(
    keyResultId: KeyResultDTO['id'],
  ): Promise<ProgressReport | undefined> {
    return this.repository.findOne({ where: { keyResultId }, order: { createdAt: 'DESC' } })
  }

  async buildProgressReports(
    progressReports: Partial<ProgressReportDTO> | Array<Partial<ProgressReportDTO>>,
  ): Promise<Array<Partial<ProgressReportDTO>>> {
    const enhancementPromises = Array.isArray(progressReports)
      ? progressReports.map(this.enhanceWithPreviousValue)
      : [this.enhanceWithPreviousValue(progressReports)]
    const progressReportsWithPreviousValues = remove(await Promise.all(enhancementPromises))

    return progressReportsWithPreviousValues
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

    if (enhancedProgressReport.valuePrevious === enhancedProgressReport.valueNew)
      throw new DuplicateEntityError('This progress report is duplicated from latest')
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
}

export default DomainProgressReportService
