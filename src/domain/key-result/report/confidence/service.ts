import { Injectable } from '@nestjs/common'
import { remove } from 'lodash'

import { KeyResultDTO } from 'domain/key-result/dto'
import { ConfidenceReportDTO } from 'domain/key-result/report/confidence/dto'
import DomainService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { ConfidenceReport } from './entities'
import DomainConfidenceReportRepository from './repository'

@Injectable()
class DomainConfidenceReportService extends DomainService<ConfidenceReport, ConfidenceReportDTO> {
  constructor(public readonly repository: DomainConfidenceReportRepository) {
    super(repository, DomainConfidenceReportService.name)
  }

  async getOneById(id: ConfidenceReportDTO['id']): Promise<ConfidenceReport> {
    return this.repository.findOne({ id })
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

  async getOneByIdIfUserIsInCompany(
    id: ConfidenceReportDTO['id'],
    user: UserDTO,
  ): Promise<ConfidenceReport | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const data = await this.repository.findByIDWithCompanyConstraint(id, userCompanies)

    return data
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
