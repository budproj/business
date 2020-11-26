import { Injectable, Logger } from '@nestjs/common'

import { ConfidenceReportDTO } from 'domain/confidence-report/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { UserDTO } from 'domain/user/dto'
import UserService from 'domain/user/service'

import { ConfidenceReport } from './entities'
import ConfidenceReportRepository from './repository'

@Injectable()
class ConfidenceReportService {
  private readonly logger = new Logger(ConfidenceReportService.name)

  constructor(
    private readonly repository: ConfidenceReportRepository,
    private readonly userService: UserService,
  ) {}

  async getOneById(id: ConfidenceReportDTO['id']): Promise<ConfidenceReport> {
    return this.repository.findOne({ id })
  }

  async getFromKeyResult(keyResultId: KeyResultDTO['id']): Promise<ConfidenceReport[]> {
    return this.repository.find({ where: { keyResultId }, order: { createdAt: 'DESC' } })
  }

  async getFromUser(userId: UserDTO['id']): Promise<ConfidenceReport[]> {
    return this.repository.find({ userId })
  }

  async getOneByIdIfUserIsInCompany(
    id: ConfidenceReportDTO['id'],
    user: UserDTO,
  ): Promise<ConfidenceReport | null> {
    const userCompanies = await this.userService.parseRequestUserCompanies(user)

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
}

export default ConfidenceReportService
