import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { uniqBy, sum } from 'lodash'
import { Any, FindConditions } from 'typeorm'

import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { DEFAULT_CONFIDENCE } from '@core/modules/key-result/check-in/key-result-check-in.constants'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { ObjectiveProvider } from '@core/modules/objective/objective.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { TeamProvider } from '@core/modules/team/team.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { KeyResultCheckInInterface } from './check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from './check-in/key-result-check-in.orm-entity'
import { KeyResultCheckInProvider } from './check-in/key-result-check-in.provider'
import { KeyResultCommentInterface } from './comment/key-result-comment.interface'
import { KeyResultComment } from './comment/key-result-comment.orm-entity'
import { KeyResultCommentProvider } from './comment/key-result-comment.provider'
import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResult } from './key-result.orm-entity'
import { KeyResultRepository } from './key-result.repository'
import { KeyResultSpecification } from './key-result.specification'
import { KeyResultTimelineProvider } from './timeline.provider'
import { KeyResultTimelineEntry } from './types/key-result-timeline-entry.type'

@Injectable()
export class KeyResultProvider extends CoreEntityProvider<KeyResult, KeyResultInterface> {
  private readonly specifications: KeyResultSpecification = new KeyResultSpecification()
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(
    public readonly keyResultCommentProvider: KeyResultCommentProvider,
    public readonly keyResultCheckInProvider: KeyResultCheckInProvider,
    public readonly timeline: KeyResultTimelineProvider,
    protected readonly repository: KeyResultRepository,
    @Inject(forwardRef(() => TeamProvider))
    private readonly teamProvider: TeamProvider,
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

  public async getFromTeams(
    teams: TeamInterface | TeamInterface[],
    filters?: FindConditions<KeyResult>,
    options?: GetOptions<KeyResult>,
  ): Promise<KeyResult[]> {
    const isEmptyArray = Array.isArray(teams) ? teams.length === 0 : false
    if (!teams || isEmptyArray) return

    const teamsArray = Array.isArray(teams) ? teams : [teams]
    const teamIDs = teamsArray.map((team) => team.id)
    const whereSelector = {
      ...filters,
      teamId: Any(teamIDs),
    }

    return this.repository.find({
      ...options,
      where: whereSelector,
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

    return uniqBy(keyResults, 'id')
  }

  public async getComments(
    keyResult: KeyResultInterface,
    filters?: FindConditions<KeyResultCommentInterface>,
    options?: GetOptions<KeyResultCommentInterface>,
  ): Promise<KeyResultComment[]> {
    const selector = {
      ...filters,
      keyResultId: keyResult.id,
    }

    return this.keyResultCommentProvider.getMany(selector, undefined, options)
  }

  public async getCheckIns(
    keyResult: KeyResultInterface,
    filters?: FindConditions<KeyResultCheckInInterface>,
    options?: GetOptions<KeyResultCheckInInterface>,
  ): Promise<KeyResultCheckIn[]> {
    const selector = {
      ...filters,
      keyResultId: keyResult.id,
    }

    return this.keyResultCheckInProvider.getMany(selector, undefined, options)
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
    return {
      text: data.text,
      userId: user.id,
      keyResultId: data.keyResultId,
    }
  }

  public async getFromKeyResultCommentID(
    keyResultCommentID: string,
  ): Promise<KeyResult | undefined> {
    const keyResultComment = await this.keyResultCommentProvider.getOne({ id: keyResultCommentID })
    if (!keyResultComment) return

    return this.getOne({ id: keyResultComment.keyResultId })
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

    return {
      userId: user.id,
      keyResultId: checkInData.keyResultId,
      value: checkInData.value,
      confidence: checkInData.confidence,
      comment: checkInData.comment,
      parentId: previousCheckIn?.id,
    }
  }

  public async getFromKeyResultCheckInID(keyResultCheckInID?: string): Promise<KeyResult> {
    if (!keyResultCheckInID) return
    const keyResultCheckIn = await this.keyResultCheckInProvider.getOne({ id: keyResultCheckInID })

    return this.getOne({ id: keyResultCheckIn.keyResultId })
  }

  public async getParentCheckInFromCheckIn(
    keyResultCheckIn: KeyResultCheckInInterface,
  ): Promise<KeyResultCheckIn | undefined> {
    return this.keyResultCheckInProvider.getOne({ id: keyResultCheckIn.parentId })
  }

  public async getCheckInProgress(keyResultCheckIn: KeyResultCheckIn): Promise<number> {
    const keyResult = await this.getOne({ id: keyResultCheckIn.keyResultId })
    return this.keyResultCheckInProvider.getProgressFromValue(keyResult, keyResultCheckIn?.value)
  }

  public async getLatestCheckInForKeyResultAtDate(
    keyResult: KeyResultInterface,
    date?: Date,
  ): Promise<KeyResultCheckIn> {
    date ??= new Date()
    return this.keyResultCheckInProvider.getLatestFromKeyResultAtDate(keyResult, date)
  }

  public calculateKeyResultCheckInListAverageProgress(
    keyResultCheckInList: Array<KeyResultCheckIn | undefined>,
    keyResults: KeyResult[],
  ) {
    if (keyResultCheckInList.length === 0) return 0

    const progressList = keyResultCheckInList.map((checkIn, index) =>
      this.keyResultCheckInProvider.getProgressFromValue(keyResults[index], checkIn?.value),
    )

    return sum(progressList) / keyResultCheckInList.length
  }

  public async getLatestCheckInForTeam(team: TeamInterface) {
    const users = await this.teamProvider.getUsersInTeam(team)
    return this.keyResultCheckInProvider.getLatestFromUsers(users)
  }

  public async isOutdated(keyResult: KeyResult): Promise<boolean> {
    const keyResultIndexes = {
      id: keyResult.id,
    }
    const isActive = await this.isActiveFromIndexes(keyResultIndexes)

    return isActive && this.specifications.isOutdated.isSatisfiedBy(keyResult)
  }

  public async getTimeline(
    keyResult: KeyResultInterface,
    queryOptions?: GetOptions<KeyResultComment | KeyResultCheckIn>,
  ): Promise<KeyResultTimelineEntry[]> {
    const timelineQueryResult = await this.timeline.buildUnionQuery(keyResult, queryOptions)
    return this.timeline.getEntriesForTimelineOrder(timelineQueryResult)
  }

  public async getFromID(id: string): Promise<KeyResult> {
    return this.repository.findOne({ id })
  }

  public async getFromIndexes(indexes: Partial<KeyResultInterface>): Promise<KeyResult> {
    return this.repository.findOne(indexes)
  }

  public async createCheckIn(
    checkIn: Partial<KeyResultCheckInInterface>,
  ): Promise<KeyResultCheckIn> {
    const queryResult = await this.keyResultCheckInProvider.createCheckIn(checkIn)
    return queryResult[0]
  }

  public async createComment(
    comment: Partial<KeyResultCommentInterface>,
  ): Promise<KeyResultComment> {
    const queryResult = await this.keyResultCommentProvider.createComment(comment)
    return queryResult[0]
  }

  public async getKeyResultCheckIn(
    indexes: Partial<KeyResultCheckInInterface>,
  ): Promise<KeyResultCheckIn> {
    return this.keyResultCheckInProvider.getOne(indexes)
  }

  public async getKeyResultComment(
    indexes: Partial<KeyResultCommentInterface>,
  ): Promise<KeyResultComment> {
    return this.keyResultCommentProvider.getOne(indexes)
  }

  public getCheckInDeltaValue(
    checkIn: KeyResultCheckIn,
    keyResult: KeyResult,
    parent?: KeyResultCheckIn,
  ): number {
    const previousValue = parent?.value ?? keyResult.initialValue
    return checkIn.value - previousValue
  }

  public getCheckInDeltaProgress(
    checkIn: KeyResultCheckIn,
    keyResult: KeyResult,
    parent?: KeyResultCheckIn,
  ): number {
    const currentProgress = this.keyResultCheckInProvider.getProgressFromValue(
      keyResult,
      checkIn.value,
    )
    const previousProgress = this.keyResultCheckInProvider.getProgressFromValue(
      keyResult,
      parent?.value,
    )

    return currentProgress - previousProgress
  }

  public getCheckInDeltaConfidence(
    checkIn: KeyResultCheckIn,
    keyResult: KeyResult,
    parent?: KeyResultCheckIn,
  ): number {
    const previousConfidence = parent?.confidence ?? DEFAULT_CONFIDENCE
    return checkIn.confidence - previousConfidence
  }

  public getCheckInDeltaConfidenceTag(
    checkIn: KeyResultCheckIn,
    _keyResult: KeyResult,
    parent?: KeyResultCheckIn,
  ): number {
    return this.confidenceTagAdapter.differenceInConfidenceTagIndexes(
      parent?.confidence,
      checkIn.confidence,
    )
  }

  protected async protectCreationQuery(
    _query: CreationQuery<KeyResult>,
    _data: Partial<KeyResultInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
