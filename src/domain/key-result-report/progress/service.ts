import { Injectable, Logger } from '@nestjs/common'
import { remove } from 'lodash'

import { ProgressReportDTO } from 'domain/key-result-report/progress/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'
import UserService from 'domain/user/service'

import { ProgressReport } from './entities'
import ProgressReportRepository from './repository'

@Injectable()
class ProgressReportService {
  private readonly logger = new Logger(ProgressReportService.name)

  constructor(
    private readonly repository: ProgressReportRepository,
    private readonly userService: UserService,
  ) {}

  async getOneById(id: ProgressReportDTO['id']): Promise<ProgressReport> {
    return this.repository.findOne({ id })
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

  async getOneByIdIfUserIsInCompany(
    id: ProgressReportDTO['id'],
    user: UserDTO,
  ): Promise<ProgressReport | null> {
    const userCompanies = await this.userService.parseRequestUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const data = await this.repository.findByIDWithCompanyConstraint(id, userCompanies)

    return data
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

    if (enhancedProgressReport.valuePrevious === enhancedProgressReport.valueNew) return
    return enhancedProgressReport
  }
}

export default ProgressReportService
