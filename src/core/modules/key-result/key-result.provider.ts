import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { uniqBy } from 'lodash'
import { Any, FindConditions } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { ObjectiveProvider } from '../objective/objective.provider'

import { KeyResultCheckInInterface } from './check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from './check-in/key-result-check-in.orm-entity'
import { KeyResultCheckInProvider } from './check-in/key-result-check-in.provider'
import { KeyResultCommentInterface } from './comment/key-result-comment.interface'
import { KeyResultComment } from './comment/key-result-comment.orm-entity'
import { KeyResultCommentProvider } from './comment/key-result-comment.provider'
import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResult } from './key-result.orm-entity'
import { KeyResultRepository } from './key-result.repository'

@Injectable()
export class KeyResultProvider extends CoreEntityProvider<KeyResult, KeyResultInterface> {
  constructor(
    public readonly keyResultCommentProvider: KeyResultCommentProvider,
    public readonly keyResultCheckInProvider: KeyResultCheckInProvider,
    protected readonly repository: KeyResultRepository,
    @Inject(forwardRef(() => ObjectiveProvider))
    private readonly objectiveProvider: ObjectiveProvider,
  ) {
    super(KeyResultProvider.name, repository)
  }

  public async getFromOwner(
    user: UserInterface,
    filters?: FindConditions<KeyResult>,
    options?: GetOptions<KeyResult>,
  ): Promise<KeyResult[]> {
    const queryOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      ...filters,
      ownerId: user.id,
    }

    return this.repository.find({
      ...queryOptions,
      where: whereSelector,
    })
  }

  public async getFromTeams(teams: TeamInterface | TeamInterface[]): Promise<KeyResult[]> {
    const isEmptyArray = Array.isArray(teams) ? teams.length === 0 : false
    if (!teams || isEmptyArray) return

    const teamsArray = Array.isArray(teams) ? teams : [teams]

    return this.repository.find({
      teamId: Any(teamsArray.map((team) => team.id)),
    })
  }

  public async getFromObjective(
    objective: ObjectiveInterface,
    filters?: Partial<KeyResultInterface>,
    options?: GetOptions<KeyResult>,
  ) {
    const queryOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      ...filters,
      objectiveId: objective.id,
    }

    return this.repository.find({
      ...queryOptions,
      where: whereSelector,
    })
  }

  public async getFromObjectives(
    objectives: ObjectiveInterface[],
    filters?: Partial<KeyResultInterface>,
    options?: GetOptions<KeyResult>,
  ) {
    const objectiveIDs = objectives.map((objective) => objective.id)

    const queryOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      ...filters,
      objectiveId: Any(objectiveIDs),
    }

    const keyResults = await this.repository.find({
      ...queryOptions,
      where: whereSelector,
    })

    const uniqueKeyResults = uniqBy(keyResults, 'id')

    return uniqueKeyResults
  }

  public async getComments(
    keyResult: KeyResultInterface,
    options?: GetOptions<KeyResultComment>,
  ): Promise<KeyResultComment[]> {
    const selector = { keyResultId: keyResult.id }

    return this.keyResultCommentProvider.getMany(selector, undefined, options)
  }

  public async getCommentsCreatedByUser(
    user: UserInterface,
    filters?: FindConditions<KeyResultComment>,
    options?: GetOptions<KeyResultComment>,
  ): Promise<KeyResultComment[]> {
    const selector = {
      ...filters,
      userId: user.id,
    }

    return this.keyResultCommentProvider.getMany(selector, undefined, options)
  }

  public async getCheckInsCreatedByUser(
    user: UserInterface,
    filters?: FindConditions<KeyResultCheckIn>,
    options?: GetOptions<KeyResultCheckIn>,
  ): Promise<KeyResultCheckIn[]> {
    const selector = {
      ...filters,
      userId: user.id,
    }

    return this.keyResultCheckInProvider.getMany(selector, undefined, options)
  }

  public createUserCommentData(
    user: UserInterface,
    data: Partial<KeyResultCommentInterface>,
  ): Partial<KeyResultCommentInterface> {
    const comment: Partial<KeyResultCommentInterface> = {
      text: data.text,
      userId: user.id,
      keyResultId: data.keyResultId,
    }

    return comment
  }

  public async getFromKeyResultCommentID(
    keyResultCommentID: string,
  ): Promise<KeyResult | undefined> {
    const keyResultComment = await this.keyResultCommentProvider.getOne({ id: keyResultCommentID })
    if (!keyResultComment) return

    const keyResult = await this.getOne({ id: keyResultComment.keyResultId })

    return keyResult
  }

  public async isActiveFromIndexes(
    keyResultIndexes: Partial<KeyResultInterface>,
  ): Promise<boolean> {
    const keyResult = await this.repository.findOne(keyResultIndexes)

    return this.objectiveProvider.isActiveFromIndexes({ id: keyResult.objectiveId })
  }

  public async buildCheckInForUser(
    user: UserInterface,
    checkInData: Partial<KeyResultCheckInInterface>,
  ): Promise<Partial<KeyResultCheckInInterface>> {
    const keyResult = await this.getOne({ id: checkInData.keyResultId })
    const previousCheckIn = await this.keyResultCheckInProvider.getLatestFromKeyResult(keyResult)

    const checkIn: Partial<KeyResultCheckInInterface> = {
      userId: user.id,
      keyResultId: checkInData.keyResultId,
      value: checkInData.value,
      confidence: checkInData.confidence,
      comment: checkInData.comment,
      parentId: previousCheckIn?.id,
    }

    return checkIn
  }

  public async getFromKeyResultCheckInID(keyResultCheckInID: string): Promise<KeyResult> {
    const keyResultCheckIn = await this.keyResultCheckInProvider.getOne({ id: keyResultCheckInID })
    const keyResult = await this.getOne({ id: keyResultCheckIn.keyResultId })

    return keyResult
  }

  public async getParentCheckInFromCheckIn(
    keyResultCheckIn: KeyResultCheckInInterface,
  ): Promise<KeyResultCheckIn> {
    return this.keyResultCheckInProvider.getOne({ id: keyResultCheckIn.parentId })
  }

  public async getCheckInProgress(keyResultCheckIn: KeyResultCheckIn): Promise<number> {
    const keyResult = await this.getOne({ id: keyResultCheckIn.keyResultId })
    const normalizedCheckIn = this.keyResultCheckInProvider.transformCheckInToRelativePercentage(
      keyResult,
      keyResultCheckIn,
    )

    return normalizedCheckIn.value
  }

  public async getCheckInProgressIncrease(keyResultCheckIn: KeyResultCheckIn): Promise<number> {
    const keyResult = await this.getOne({ id: keyResultCheckIn.keyResultId })
    const previousCheckIn = await this.getParentCheckInFromCheckIn(keyResultCheckIn)

    const normalizedCurrentCheckIn = this.keyResultCheckInProvider.transformCheckInToRelativePercentage(
      keyResult,
      keyResultCheckIn,
    )
    if (!previousCheckIn) return normalizedCurrentCheckIn.value

    const normalizedPreviousCheckIn = this.keyResultCheckInProvider.transformCheckInToRelativePercentage(
      keyResult,
      previousCheckIn,
    )

    const deltaProgress = this.keyResultCheckInProvider.calculateValueDifference(
      normalizedPreviousCheckIn,
      normalizedCurrentCheckIn,
    )

    return deltaProgress
  }

  public async getCheckInConfidenceIncrease(keyResultCheckIn: KeyResultCheckIn): Promise<number> {
    const previousCheckIn = await this.getParentCheckInFromCheckIn(keyResultCheckIn)

    const deltaConfidence = this.keyResultCheckInProvider.calculateConfidenceDifference(
      previousCheckIn,
      keyResultCheckIn,
    )

    return deltaConfidence
  }

  public async getCheckInValueIncrease(keyResultCheckIn: KeyResultCheckIn): Promise<number> {
    const keyResult = await this.getOne({ id: keyResultCheckIn.keyResultId })
    const previousCheckIn = await this.getParentCheckInFromCheckIn(keyResultCheckIn)
    if (!previousCheckIn) return keyResultCheckIn.value - keyResult.initialValue

    const deltaValue = keyResultCheckIn.value - previousCheckIn.value

    return deltaValue
  }

  public async getLatestCheckInForKeyResultAtDate(
    keyResult: KeyResultInterface,
    date?: Date,
  ): Promise<KeyResultCheckIn> {
    date ??= new Date()
    const latestCheckIn = await this.keyResultCheckInProvider.getLatestFromKeyResultAtDate(
      keyResult,
      date,
    )

    return latestCheckIn
  }

  public calculateKeyResultCheckInListAverageProgress(
    keyResultCheckInList: KeyResultCheckIn[],
    keyResults: KeyResult[],
  ) {
    const normalizedKeyResultCheckInList = keyResultCheckInList.map((keyResultCheckIn, index) =>
      this.keyResultCheckInProvider.normalizeCheckInToPercentage(
        keyResults[index],
        keyResultCheckIn,
      ),
    )
    const keyResultCheckInListAverageProgress = this.keyResultCheckInProvider.calculateAverageValueFromCheckInList(
      normalizedKeyResultCheckInList,
    )

    return keyResultCheckInListAverageProgress
  }

  protected async protectCreationQuery(
    _query: CreationQuery<KeyResult>,
    _data: Partial<KeyResultInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
