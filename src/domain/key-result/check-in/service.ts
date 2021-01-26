import { Injectable, Scope } from '@nestjs/common'
import { Any } from 'typeorm'

import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'
import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { UserDTO } from 'src/domain/user/dto'

import DomainKeyResultCheckInRepository from './repository'

export interface DomainKeyResultCheckInServiceInterface {
  snapshot: Date

  getLatestFromUsers: (users: UserDTO[]) => Promise<KeyResultCheckIn | null>
}

@Injectable({ scope: Scope.REQUEST })
class DomainKeyResultCheckInService extends DomainEntityService<
  KeyResultCheckIn,
  KeyResultCheckInDTO
> {
  public snapshot: Date

  constructor(public readonly repository: DomainKeyResultCheckInRepository) {
    super(repository, DomainKeyResultCheckInService.name)
  }

  public async getLatestFromUsers(users: UserDTO[]) {
    const userIDs = users.map((user) => user.id)

    const selector = {
      userId: Any(userIDs),
    }
    const options = {
      orderBy: {
        createdAt: DOMAIN_QUERY_ORDER.DESC,
      },
    }

    const latestCheckIn = await this.getOne(selector, undefined, options)

    return latestCheckIn
  }

  protected async createIfUserIsInCompany(
    _data: Partial<KeyResultCheckIn>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserIsInTeam(
    _data: Partial<KeyResultCheckIn>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserOwnsIt(
    _data: Partial<KeyResultCheckIn>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  // Async getFromKeyResult(
  //   keyResultId: KeyResultDTO['id'],
  //   options?: { limit?: number },
  // ): Promise<KeyResultCheckIn[]> {
  //   return this.repository.find({
  //     where: { keyResultId },
  //     order: { createdAt: 'DESC' },
  //     take: options?.limit ?? 0,
  //   })
  // }
  //
  // async getFromUser(userId: UserDTO['id']): Promise<KeyResultCheckIn[]> {
  //   return this.repository.find({ userId })
  // }
  //
  // async getFromUsers(userIDs: Array<UserDTO['id']>) {
  //   return this.repository.selectManyInUserIDs(userIDs)
  // }
  //
  // async getLatestFromKeyResult(keyResultID: KeyResultDTO['id']) {
  //   const date = new Date()
  //   const progress = await this.getLatestFromDateForKeyResult(keyResultID, date)
  //
  //   return progress
  // }
  //
  // async getLatestFromSnapshotForKeyResult(keyResultID: KeyResultDTO['id']) {
  //   const progress = await this.getLatestFromDateForKeyResult(keyResultID, this.snapshotDate)
  //
  //   return progress
  // }
  //
  // async getLatestFromDateForKeyResult(keyResultId: KeyResultDTO['id'], date: Date) {
  //   const isoDate = date.toISOString()
  //   const progress = await this.repository.findOne({
  //     where: { keyResultId, createdAt: LessThanOrEqual(isoDate) },
  //     order: { createdAt: 'DESC' },
  //   })
  //
  //   return progress
  // }
  //
  // async buildKeyResultCheckIns(
  //   progressReports: Partial<KeyResultCheckInDTO> | Array<Partial<KeyResultCheckInDTO>>,
  // ): Promise<Array<Partial<KeyResultCheckInDTO>>> {
  //   const normalizedReportPromises = Array.isArray(progressReports)
  //     ? progressReports.map(async (progressReport) => this.normalizeReport(progressReport))
  //     : [this.normalizeReport(progressReports)]
  //   const normalizedReports = remove(await Promise.all(normalizedReportPromises))
  //
  //   return normalizedReports
  // }
  //
  // async create(
  //   rawKeyResultCheckIns: Partial<KeyResultCheckInDTO> | Array<Partial<KeyResultCheckInDTO>>,
  // ): Promise<KeyResultCheckIn[]> {
  //   const progressReports = await this.buildKeyResultCheckIns(rawKeyResultCheckIns)
  //
  //   this.logger.debug({
  //     progressReports,
  //     message: 'Creating new progress report',
  //   })
  //
  //   const data = await this.repository.insert(progressReports)
  //   const createdKeyResultCheckIns = data.raw
  //
  //   return createdKeyResultCheckIns
  // }
  //
  // async enhanceWithPreviousValue(
  //   progressReport: Partial<KeyResultCheckInDTO>,
  // ): Promise<Partial<KeyResultCheckInDTO | undefined>> {
  //   const latestKeyResultCheckIn = await this.getLatestFromKeyResult(progressReport.keyResultId)
  //   const enhancedKeyResultCheckIn = {
  //     ...progressReport,
  //     valuePrevious: latestKeyResultCheckIn?.valueNew,
  //   }
  //
  //   this.logger.debug({
  //     progressReport,
  //     enhancedKeyResultCheckIn,
  //     latestKeyResultCheckIn,
  //     message: 'Enhancing progress report with latest report value',
  //   })
  //
  //   return enhancedKeyResultCheckIn
  // }
  //
  // async createIfUserIsInCompany(
  //   data: Partial<KeyResultCheckIn>,
  //   user: UserDTO,
  // ): Promise<KeyResultCheckIn[] | null> {
  //   const selector = { id: data.keyResultId }
  //   const keyResult = await this.keyResultService.getOneWithConstraint(
  //     CONSTRAINT.COMPANY,
  //     selector,
  //     user,
  //   )
  //   if (!keyResult) return
  //
  //   return this.create(data)
  // }
  //
  // async createIfUserIsInTeam(
  //   data: Partial<KeyResultCheckIn>,
  //   user: UserDTO,
  // ): Promise<KeyResultCheckIn[] | null> {
  //   const selector = { id: data.keyResultId }
  //   const keyResult = await this.keyResultService.getOneWithConstraint(
  //     CONSTRAINT.TEAM,
  //     selector,
  //     user,
  //   )
  //   if (!keyResult) return
  //
  //   return this.create(data)
  // }
  //
  // async createIfUserOwnsIt(
  //   data: Partial<KeyResultCheckIn>,
  //   user: UserDTO,
  // ): Promise<KeyResultCheckIn[] | null> {
  //   const selector = { id: data.keyResultId }
  //   const keyResult = await this.keyResultService.getOneWithConstraint(
  //     CONSTRAINT.OWNS,
  //     selector,
  //     user,
  //   )
  //   if (!keyResult) return
  //
  //   return this.create(data)
  // }
  //
  // async normalizeReport(confidenceReport: Partial<KeyResultCheckInDTO>) {
  //   const enhancedWithPreviousValue = await this.enhanceWithPreviousValue(confidenceReport)
  //   const ensuredNewValue = await this.ensureNewValue(enhancedWithPreviousValue)
  //
  //   return ensuredNewValue
  // }
  //
  // async ensureNewValue(confidenceReport: Partial<KeyResultCheckInDTO>) {
  //   if (confidenceReport.valueNew) return confidenceReport
  //
  //   const previousValue =
  //     confidenceReport.valuePrevious ??
  //     (await this.keyResultService.getInitialValue(confidenceReport.keyResultId))
  //
  //   return {
  //     ...confidenceReport,
  //     valueNew: previousValue,
  //   }
  // }
}

export default DomainKeyResultCheckInService
