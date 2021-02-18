import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { sum } from 'lodash'
import { SelectQueryBuilder } from 'typeorm'

import { DOMAIN_QUERY_ORDER } from 'src/domain/constants'
import { DomainCreationQuery, DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import {
  MAX_PERCENTAGE_PROGRESS,
  MIN_PERCENTAGE_PROGRESS,
} from 'src/domain/key-result/check-in/constants'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import {
  KeyResultCheckInFilters,
  KeyResultCheckInQueryOptions,
} from 'src/domain/key-result/check-in/types'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { KeyResult } from 'src/domain/key-result/entities'
import DomainKeyResultService from 'src/domain/key-result/service'
import { DomainKeyResultTimelineOrderEntry } from 'src/domain/key-result/timeline'
import { DEFAULT_CONFIDENCE } from 'src/domain/team/constants'
import { UserDTO } from 'src/domain/user/dto'

import DomainKeyResultCheckInRepository from './repository'

export interface DomainKeyResultCheckInServiceInterface {
  getLatestFromUsers: (
    users: UserDTO[],
    filters?: KeyResultCheckInFilters,
  ) => Promise<KeyResultCheckIn | null>
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

  public async getLatestFromUsers(users: UserDTO[], filters?: KeyResultCheckInFilters) {
    const userIDs = users.map((user) => user.id)
    if (!userIDs || userIDs.length === 0) return

    const keyResultCheckInFilters = {
      userIDs,
      ...filters,
    }
    const options: KeyResultCheckInQueryOptions = {
      limit: 1,
      orderBy: [['createdAt', DOMAIN_QUERY_ORDER.DESC]],
    }

    const latestCheckInArray = await this.repository.findWithFilters(
      keyResultCheckInFilters,
      options,
    )
    const latestCheckIn = latestCheckInArray[0]

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
    const numberOfCheckIns = progressList.length === 0 ? 1 : progressList.length

    const averageProgress = sum(progressList) / numberOfCheckIns

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
    const { confidence } = newCheckIn
    const previousConfidence = oldCheckIn?.confidence ?? DEFAULT_CONFIDENCE

    const deltaConfidence = confidence - previousConfidence

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

  protected async setupDeleteMutationQuery(query: SelectQueryBuilder<KeyResultCheckIn>) {
    const currentKeyResultCheckIn = await query
      .leftJoinAndSelect(`${KeyResultCheckIn.name}.keyResult`, 'keyResult')
      .getOne()
    if (!currentKeyResultCheckIn) return query

    const { keyResult } = currentKeyResultCheckIn
    const latestCheckIn = await this.getLatestFromKeyResult(keyResult)

    const constrainedQuery = query.andWhere(`${KeyResultCheckIn.name}.id = :latestCheckInID`, {
      latestCheckInID: latestCheckIn.id,
    })

    return constrainedQuery
  }

  private minmax(value: number, min: number, max: number) {
    const isBetween = value >= min && value <= max
    const isLess = value < min

    const minOrMax = isLess ? min : max

    return isBetween ? value : minOrMax
  }
}

export default DomainKeyResultCheckInService
