import { Injectable } from '@nestjs/common'
import { remove } from 'lodash'
import { FindConditions } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'
import DomainEntityService from 'domain/service'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { ProgressReport } from './entities'
import DomainProgressReportRepository from './repository'

@Injectable()
class DomainProgressReportService extends DomainEntityService<ProgressReport, ProgressReportDTO> {
  constructor(public readonly repository: DomainProgressReportRepository) {
    super(repository, DomainProgressReportService.name)
  }

  async canUserReadForCompany(
    selector: FindConditions<ProgressReport>,
    userCompanies: Array<CompanyDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const relatedCompanyIDs = relatedTeams.map((team) => team.companyId)
    const canUserRead = relatedCompanyIDs.every((companyID) => userCompanies.includes(companyID))

    return canUserRead
  }

  async canUserReadForTeam(
    selector: FindConditions<ProgressReport>,
    userTeams: Array<TeamDTO['id']>,
  ): Promise<boolean> {
    const relatedTeams = await this.repository.findRelatedTeams(selector)
    const canUserRead = relatedTeams.every((team) => userTeams.includes(team.id))

    return canUserRead
  }

  async canUserReadForSelf(
    selector: FindConditions<ProgressReport>,
    user: UserDTO,
  ): Promise<boolean> {
    const selectedProgressReports = await this.repository.find(selector)
    const canUserRead = selectedProgressReports.every(
      (progressReport) => progressReport.userId === user.id,
    )

    return canUserRead
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

export default DomainProgressReportService
