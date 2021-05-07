import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { sum } from 'lodash'
import { Any, SelectQueryBuilder } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { Sorting } from '@core/enums/sorting'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { KeyResultTimelineQueryResult } from '../interfaces/key-result-timeline-query-result.interface'
import { KeyResultInterface } from '../interfaces/key-result.interface'
import { KeyResult } from '../key-result.orm-entity'
import { KeyResultProvider } from '../key-result.provider'

import {
  DEFAULT_CONFIDENCE,
  MAX_PERCENTAGE_PROGRESS,
  MIN_PERCENTAGE_PROGRESS,
} from './key-result-check-in.constants'
import { KeyResultCheckInInterface } from './key-result-check-in.interface'
import { KeyResultCheckIn } from './key-result-check-in.orm-entity'
import { KeyResultCheckInRepository } from './key-result-check-in.repository'

@Injectable()
export class KeyResultCheckInProvider extends CoreEntityProvider<
  KeyResultCheckIn,
  KeyResultCheckInInterface
> {
  private keyResultProvider: KeyResultProvider

  constructor(
    protected readonly repository: KeyResultCheckInRepository,
    private readonly moduleReference: ModuleRef,
  ) {
    super(KeyResultCheckInProvider.name, repository)
  }

  public async getLatestFromUsers(users: UserInterface[]): Promise<KeyResultCheckIn> {
    const userIDs = users.map((user) => user.id)
    if (!userIDs || userIDs.length === 0) return

    const selector = {
      userId: Any(userIDs),
    }

    const latestCheckInArray = await this.repository.find({
      where: selector,
      take: 1,
      order: {
        createdAt: Sorting.DESC,
      },
    })

    const latestCheckIn = latestCheckInArray[0]

    return latestCheckIn
  }

  public async getLatestFromKeyResult(keyResult: KeyResultInterface): Promise<KeyResultCheckIn> {
    const date = new Date()
    const checkIn = await this.repository.getLatestFromDateForKeyResult(date, keyResult)

    return checkIn
  }

  public async getLatestFromKeyResultAtDate(
    keyResult: KeyResultInterface,
    snapshot: Date,
  ): Promise<KeyResultCheckIn> {
    const checkIn = await this.repository.getLatestFromDateForKeyResult(snapshot, keyResult)

    return checkIn
  }

  public transformCheckInToRelativePercentage(
    keyResult: KeyResultInterface,
    checkIn?: KeyResultCheckIn,
  ): KeyResultCheckIn {
    const { initialValue, goal } = keyResult
    const value = checkIn ? checkIn.value : initialValue

    const relativePercentageProgress = ((value - initialValue) * 100) / (goal - initialValue)
    const normalizedCheckIn: KeyResultCheckIn = {
      ...checkIn,
      value: relativePercentageProgress,
    }

    const limitedNormalizedCheckIn = this.limitPercentageCheckIn(normalizedCheckIn)

    return limitedNormalizedCheckIn
  }

  public limitPercentageCheckIn(checkIn: KeyResultCheckIn): KeyResultCheckIn {
    const limitedValue = this.minmax(
      checkIn.value,
      MIN_PERCENTAGE_PROGRESS,
      MAX_PERCENTAGE_PROGRESS,
    )

    const limitedCheckIn: KeyResultCheckIn = {
      ...checkIn,
      value: limitedValue,
    }

    return limitedCheckIn
  }

  public calculateAverageValueFromCheckInList(
    checkIns: KeyResultCheckIn[],
  ): KeyResultCheckIn['value'] {
    const valueList = checkIns.map((checkIn) => checkIn?.value ?? 0)
    const numberOfCheckIns = valueList.length === 0 ? 1 : valueList.length

    const averageValue = sum(valueList) / numberOfCheckIns

    return averageValue
  }

  public calculateValueDifference(
    oldCheckIn: KeyResultCheckInInterface,
    newCheckIn: KeyResultCheckInInterface,
  ): KeyResultCheckIn['value'] {
    const deltaValue = newCheckIn.value - oldCheckIn.value

    return deltaValue
  }

  public calculateConfidenceDifference(
    oldCheckIn: KeyResultCheckInInterface,
    newCheckIn: KeyResultCheckInInterface,
  ): KeyResultCheckIn['value'] {
    const { confidence } = newCheckIn
    const previousConfidence = oldCheckIn?.confidence ?? DEFAULT_CONFIDENCE

    const deltaConfidence = confidence - previousConfidence

    return deltaConfidence
  }

  public normalizeCheckInToPercentage(keyResult: KeyResult, keyResultCheckIn?: KeyResultCheckIn) {
    const percentageCheckIn = this.transformCheckInToRelativePercentage(keyResult, keyResultCheckIn)
    const percentageCheckInWithLimit = this.limitPercentageCheckIn(percentageCheckIn)

    return percentageCheckInWithLimit
  }

  public async getForTimelineEntries(
    entries: KeyResultTimelineQueryResult[],
  ): Promise<KeyResultCheckIn[]> {
    const checkInIDs = entries.map((entry) => entry.id)
    const result = await this.repository.findByIds(checkInIDs)

    return result
  }

  public async createCheckIn(
    checkIn: Partial<KeyResultCheckInInterface>,
  ): Promise<KeyResultCheckIn[]> {
    return this.create(checkIn)
  }

  protected onModuleInit(): void {
    this.keyResultProvider = this.moduleReference.get(KeyResultProvider)
  }

  protected async protectCreationQuery(
    query: CreationQuery<KeyResultCheckIn>,
    data: Partial<KeyResultCheckInInterface>,
    queryContext: CoreQueryContext,
  ): Promise<KeyResultCheckIn[]> {
    const selector = { id: data.keyResultId }

    const validationData = await this.keyResultProvider.getOneWithConstraint(selector, queryContext)
    if (!validationData) return

    return query()
  }

  protected async setupDeleteMutationQuery(
    query: SelectQueryBuilder<KeyResultCheckIn>,
  ): Promise<SelectQueryBuilder<KeyResultCheckIn>> {
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

  private minmax(value: number, min: number, max: number): number {
    const isBetween = value >= min && value <= max
    const isLess = value < min

    const minOrMax = isLess ? min : max

    return isBetween ? value : minOrMax
  }
}
