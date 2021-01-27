import { Injectable } from '@nestjs/common'
import { sum } from 'lodash'
import { Any } from 'typeorm'

import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'
import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import {
  MAX_PERCENTAGE_PROGRESS,
  MIN_PERCENTAGE_PROGRESS,
} from 'src/domain/key-result/check-in/constants'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { KEY_RESULT_FORMAT } from 'src/domain/key-result/constants'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import { UserDTO } from 'src/domain/user/dto'

import DomainKeyResultCheckInRepository from './repository'

export interface DomainKeyResultCheckInServiceInterface {
  getLatestFromUsers: (users: UserDTO[]) => Promise<KeyResultCheckIn | null>
  getLatestFromKeyResult: (keyResult: KeyResultDTO) => Promise<KeyResultCheckIn | null>
  getLatestFromKeyResultAtDate: (
    keyResult: KeyResultDTO,
    date: Date,
  ) => Promise<KeyResultCheckIn | null>
  transformCheckInToPercentage: (
    checkIn: KeyResultCheckIn,
    keyResult: KeyResult,
  ) => KeyResultCheckIn
  limitPercentageCheckIn: (checkIn: KeyResultCheckIn) => KeyResultCheckIn
  calculateAverageProgressFromCheckInList: (
    checkIns: KeyResultCheckIn[],
  ) => KeyResultCheckInDTO['progress']
}

@Injectable()
class DomainKeyResultCheckInService extends DomainEntityService<
  KeyResultCheckIn,
  KeyResultCheckInDTO
> {
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

  public async getLatestFromKeyResult(keyResult: KeyResultDTO) {
    const date = new Date()
    const checkIn = await this.repository.getLatestFromDateForKeyResult(date, keyResult)

    return checkIn
  }

  public async getLatestFromKeyResultAtDate(keyResult: KeyResultDTO, snapshot: Date) {
    const checkIn = await this.repository.getLatestFromDateForKeyResult(snapshot, keyResult)

    return checkIn
  }

  public transformCheckInToPercentage(checkIn: KeyResultCheckIn, keyResult: KeyResult) {
    if (keyResult.format === KEY_RESULT_FORMAT.PERCENTAGE) return checkIn

    const { initialValue, goal } = keyResult
    const { progress } = checkIn

    const percentageProgress = ((progress - initialValue) * 100) / (goal - initialValue)
    const normalizedCheckIn: KeyResultCheckIn = {
      ...checkIn,
      progress: percentageProgress,
    }

    return normalizedCheckIn
  }

  public limitPercentageCheckIn(checkIn: KeyResultCheckIn) {
    const limitedProgress = this.minmax(
      checkIn.progress,
      MIN_PERCENTAGE_PROGRESS,
      MAX_PERCENTAGE_PROGRESS,
    )

    const limitedCheckIn: KeyResultCheckIn = {
      ...checkIn,
      progress: limitedProgress,
    }

    return limitedCheckIn
  }

  public calculateAverageProgressFromCheckInList(checkIns: KeyResultCheckIn[]) {
    const progressList = checkIns.map((checkIn) => checkIn?.progress ?? 0)
    const averageProgress = sum(progressList) / progressList.length

    return averageProgress
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

  private minmax(value: number, min: number, max: number) {
    const isBetween = value >= min && value <= max
    const isLess = value < min

    const minOrMax = isLess ? min : max

    return isBetween ? value : minOrMax
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
  //
  // async getLatestFromSnapshotForKeyResult(keyResultID: KeyResultDTO['id']) {
  //   const progress = await this.getLatestFromDateForKeyResult(keyResultID, this.snapshotDate)
  //
  //   return progress
  // }
  //
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
