import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { sum } from 'lodash'
import { Any } from 'typeorm'

import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import {
  MAX_PERCENTAGE_PROGRESS,
  MIN_PERCENTAGE_PROGRESS,
} from 'src/domain/key-result/check-in/constants'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import DomainKeyResultService from 'src/domain/key-result/service'
import { DomainKeyResultTimelineOrderEntry } from 'src/domain/key-result/timeline'
import { DEFAULT_CONFIDENCE } from 'src/domain/team/constants'
import { UserDTO } from 'src/domain/user/dto'

import DomainKeyResultCheckInRepository from './repository'

export interface DomainKeyResultCheckInServiceInterface {
  getLatestFromUsers: (users: UserDTO[]) => Promise<KeyResultCheckIn | null>
  getLatestFromKeyResult: (keyResult: KeyResultDTO) => Promise<KeyResultCheckIn | null>
  getLatestFromKeyResultAtDate: (
    keyResult: KeyResultDTO,
    date: Date,
  ) => Promise<KeyResultCheckIn | null>
  transformCheckInToRelativePercentage: (
    checkIn: KeyResultCheckIn,
    keyResult: KeyResult,
  ) => KeyResultCheckIn
  limitPercentageCheckIn: (checkIn: KeyResultCheckIn) => KeyResultCheckIn
  calculateAverageProgressFromCheckInList: (
    checkIns: KeyResultCheckIn[],
  ) => KeyResultCheckInDTO['progress']
  calculateProgressDifference: (
    oldCheckIn: KeyResultCheckInDTO,
    newCheckIn: KeyResultCheckInDTO,
  ) => number
  calculateConfidenceDifference: (
    oldCheckIn: KeyResultCheckInDTO,
    newCheckIn: KeyResultCheckInDTO,
  ) => number
  getForTimelineEntries: (
    entries: DomainKeyResultTimelineOrderEntry[],
  ) => Promise<KeyResultCheckIn[]>
}

@Injectable()
class DomainKeyResultCheckInService extends DomainEntityService<
  KeyResultCheckIn,
  KeyResultCheckInDTO
> {
  constructor(
    protected readonly repository: DomainKeyResultCheckInRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(DomainKeyResultCheckInService.name, repository)
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

  public transformCheckInToRelativePercentage(checkIn: KeyResultCheckIn, keyResult: KeyResult) {
    const { initialValue, goal } = keyResult
    const { progress } = checkIn

    const relativePercentageProgress = ((progress - initialValue) * 100) / (goal - initialValue)
    const normalizedCheckIn: KeyResultCheckIn = {
      ...checkIn,
      progress: relativePercentageProgress,
    }

    const limitedNormalizedCheckIn = this.limitPercentageCheckIn(normalizedCheckIn)

    return limitedNormalizedCheckIn
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

  public calculateProgressDifference(
    oldCheckIn: KeyResultCheckInDTO,
    newCheckIn: KeyResultCheckInDTO,
  ) {
    const deltaProgress = newCheckIn.progress - oldCheckIn.progress

    return deltaProgress
  }

  public calculateConfidenceDifference(
    oldCheckIn: KeyResultCheckInDTO,
    newCheckIn: KeyResultCheckInDTO,
  ) {
    const currentConfidence = newCheckIn.confidence
    const previousConfidence = oldCheckIn?.confidence ?? DEFAULT_CONFIDENCE

    const deltaConfidence = currentConfidence - previousConfidence

    return deltaConfidence
  }

  public async getForTimelineEntries(entries: DomainKeyResultTimelineOrderEntry[]) {
    const checkInIDs = entries.map((entry) => entry.id)
    const result = await this.repository.findByIds(checkInIDs)

    return result
  }

  protected async protectCreationQuery(
    query: DomainCreationQuery<KeyResultCheckIn>,
    data: Partial<KeyResultCheckInDTO>,
    queryContext: DomainQueryContext,
  ) {
    const selector = { id: data.keyResultId }

    const validationData = await this.keyResultService.getOneWithConstraint(selector, queryContext)
    if (!validationData) return

    return query()
  }

  private minmax(value: number, min: number, max: number) {
    const isBetween = value >= min && value <= max
    const isLess = value < min

    const minOrMax = isLess ? min : max

    return isBetween ? value : minOrMax
  }
}

export default DomainKeyResultCheckInService
