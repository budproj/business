import { Injectable } from '@nestjs/common'
import { uniqBy, pickBy, omitBy, identity, isEmpty, maxBy, flatten } from 'lodash'
import { Any, Brackets, DeleteResult, FindConditions, In } from 'typeorm'

import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import {
  DEFAULT_CONFIDENCE,
  CONFIDENCE_TAG_THRESHOLDS,
} from '@adapters/confidence-tag/confidence-tag.constants'
import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { DEFAULT_PROGRESS } from '@core/modules/key-result/check-in/key-result-check-in.constants'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'
import { EntityOrderAttributes } from '@core/types/order-attribute.type'
import { AnalyticsProvider } from '@infrastructure/analytics/analytics.provider'

import { ProgressRecord } from '../../../adapters/analytics/progress-record.interface'
import { Cycle } from '../cycle/cycle.orm-entity'
import { Cadence } from '../cycle/enums/cadence.enum'

import { KeyResultCheckInInterface } from './check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from './check-in/key-result-check-in.orm-entity'
import { KeyResultCheckInProvider } from './check-in/key-result-check-in.provider'
import { KeyResultCheckMarkProvider } from './check-mark/key-result-check-mark.provider'
import { KeyResultCommentInterface } from './comment/key-result-comment.interface'
import { KeyResultComment } from './comment/key-result-comment.orm-entity'
import { KeyResultCommentProvider } from './comment/key-result-comment.provider'
import { KeyResultInterface } from './interfaces/key-result.interface'
import { KeyResult } from './key-result.orm-entity'
import { KeyResultRelationFilterProperties, KeyResultRepository } from './key-result.repository'
import { KeyResultTimelineProvider } from './timeline.provider'
import { KeyResultTimelineEntry } from './types/key-result-timeline-entry.type'

@Injectable()
export class KeyResultProvider extends CoreEntityProvider<KeyResult, KeyResultInterface> {
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(
    public readonly keyResultCommentProvider: KeyResultCommentProvider,
    public readonly keyResultCheckMarkProvider: KeyResultCheckMarkProvider,
    public readonly keyResultCheckInProvider: KeyResultCheckInProvider,
    public readonly timeline: KeyResultTimelineProvider,
    protected readonly repository: KeyResultRepository,
    private readonly analyticsProvider: AnalyticsProvider,
  ) {
    super(KeyResultProvider.name, repository)
  }

  public getLatestCheckInFromList(
    checkInList: KeyResultCheckInInterface[],
  ): KeyResultCheckInInterface | undefined {
    return maxBy(checkInList, 'createdAt')
  }

  public async getKeyResults(
    teamsIds: Array<TeamInterface['id']>,
    filters?: FindConditions<KeyResult>,
    options?: GetOptions<KeyResult>,
    active = true,
    confidence?: ConfidenceTag,
  ): Promise<KeyResult[]> {
    const queryOptions = this.repository.marshalGetOptions(options)
    const whereSelector = {
      ...filters,
      teamId: In(teamsIds),
      objective: {
        cycle: {
          active: active ? true : undefined,
        },
      },
    }

    const relations = [
      ...(active ? ['objective', 'objective.cycle'] : []),
      ...(confidence ? ['checkIns'] : []),
    ]

    const keyResults = await this.repository.find({
      ...queryOptions,
      where: whereSelector,
      relations,
    })

    if (confidence) {
      const confidenceNumber = this.confidenceTagAdapter.getConfidenceFromTag(confidence)
      const keyResultsWithConfidence = keyResults.filter((keyResult) => {
        const latestCheckin = this.getLatestCheckInFromList(keyResult.checkIns)
        if (!latestCheckin) {
          return confidenceNumber === DEFAULT_CONFIDENCE
        }

        return latestCheckin.confidence === confidenceNumber
      })

      return keyResultsWithConfidence
    }

    return keyResults
  }

  public async getKeyResultsByConfidence(
    teamId: TeamInterface['id'],
    confidence?: ConfidenceTag,
  ): Promise<KeyResult[]> {
    const keyResults = await this.repository.find({ where: { teamId } })

    const asyncFilter = async (array: KeyResult[], predicate: (element: KeyResult) => void) => {
      const results = await Promise.all(array.map((element) => predicate(element)))

      return array.filter((_v, index) => results[index])
    }

    if (confidence) {
      const confidenceNumber = this.confidenceTagAdapter.getConfidenceFromTag(confidence)
      const keyResultsWithConfidence = await asyncFilter(
        keyResults,
        async (keyResult: KeyResult) => {
          const latestCheckin = await this.getLatestCheckInForKeyResultAtDate(keyResult.id)
          if (!latestCheckin) {
            return confidenceNumber === DEFAULT_CONFIDENCE
          }

          return latestCheckin.confidence === confidenceNumber
        },
      )

      return keyResultsWithConfidence
    }

    return keyResults
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

  public async getSupportTeam(keyResultID: string): Promise<KeyResult['supportTeamMembers']> {
    const whereSelector = {
      id: keyResultID,
    }

    const response = await this.repository.findOne({
      relations: ['supportTeamMembers'],
      where: whereSelector,
    })

    return response.supportTeamMembers
  }

  public async addUserToSupportTeam(keyResultId: string, userId: string) {
    return this.repository.addUserToSupportTeam(keyResultId, userId)
  }

  public async removeUserToSupportTeam(keyResultId: string, userId: string) {
    return this.repository.removeUserToSupportTeam(keyResultId, userId)
  }

  public async getActiveKeyResultsQuantity(teamsIds: Array<TeamInterface['id']>) {
    return this.repository.count({
      relations: ['objective', 'objective.cycle'],
      where: {
        teamId: In(teamsIds),
        objective: {
          cycle: {
            active: true,
          },
        },
      },
    })
  }

  public async getActiveConfidenceKeyResultsQuantity(teamsIds: Array<TeamInterface['id']>) {
    const keyResults = await this.repository.find({
      relations: ['objective', 'objective.cycle', 'checkIns'],
      where: {
        teamId: In(teamsIds),
        objective: {
          cycle: {
            active: true,
          },
        },
      },
    })

    const highConfidenceDefaultValue = CONFIDENCE_TAG_THRESHOLDS.high

    const confidences = keyResults.map((keyResult) => {
      const latestCheckin = this.getLatestCheckInFromList(keyResult.checkIns)
      if (latestCheckin) {
        return latestCheckin.confidence
      }

      return highConfidenceDefaultValue
    })

    return {
      high: confidences.filter((element) => element === CONFIDENCE_TAG_THRESHOLDS.high).length,
      medium: confidences.filter((element) => element === CONFIDENCE_TAG_THRESHOLDS.medium).length,
      low: confidences.filter((element) => element === CONFIDENCE_TAG_THRESHOLDS.low).length,
      barrier: confidences.filter((element) => element === CONFIDENCE_TAG_THRESHOLDS.barrier)
        .length,
    }
  }

  public async getFromTeams(
    teams: Partial<TeamInterface> | Array<Partial<TeamInterface>>,
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
    objective: Partial<ObjectiveInterface>,
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

  public async getKeyResultsFromUserByCadence(
    userID: UserInterface['id'],
    cadence: Cadence,
    isKeyResultsFromCompany?: boolean,
  ) {
    let query = this.repository
      .createQueryBuilder()
      .innerJoin(`${KeyResult.name}.objective`, 'objective')
      .innerJoin(Cycle, 'cycle', 'cycle.id = objective.cycle_id')
      .leftJoin(`${KeyResult.name}.supportTeamMembers`, 'supportTeamMembers')
      .where(
        new Brackets((qb) => {
          qb.where('KeyResult.ownerId = :userID', { userID }).orWhere(
            'supportTeamMembers.id = :userId',
            { userId: userID },
          )
        }),
      )
      .andWhere('cycle.cadence = :cadence', { cadence })
      .andWhere('cycle.active = true')

    if (isKeyResultsFromCompany) {
      query = query.andWhere(`${KeyResult.name}.teamId IS NOT NULL`)
    }

    return query.getMany()
  }

  public async getComments(
    keyResult: Partial<KeyResultInterface>,
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
    keyResult: Partial<KeyResultInterface>,
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

  public async getCheckInProgress(
    keyResultCheckIn?: KeyResultCheckInInterface,
    keyResult?: KeyResult,
  ): Promise<number> {
    if (!keyResultCheckIn) return DEFAULT_PROGRESS

    keyResult ??= await this.getOne({ id: keyResultCheckIn.keyResultId })
    return this.keyResultCheckInProvider.getProgressFromValue(keyResult, keyResultCheckIn?.value)
  }

  public async getLatestCheckInForKeyResultAtDate(
    keyResultID: string,
    date?: Date,
  ): Promise<KeyResultCheckIn> {
    date ??= new Date()
    return this.keyResultCheckInProvider.getLatestFromKeyResultAtDate(keyResultID, date)
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

  public async createKeyResult(data: KeyResultInterface): Promise<KeyResult> {
    const queryResult = await this.create(data)
    return queryResult[0]
  }

  public async deleteFromID(id: string): Promise<DeleteResult> {
    const comments = await this.keyResultCommentProvider.delete({
      keyResultId: id,
    })
    const checkIns = await this.keyResultCheckInProvider.delete({
      keyResultId: id,
    })
    const checkMarks = await this.keyResultCheckMarkProvider.delete({
      keyResultId: id,
    })
    const keyResult = await this.delete({ id })

    return {
      raw: [...comments.raw, ...checkIns.raw, ...checkMarks.raw, ...keyResult.raw],
      affected: comments.affected + checkIns.affected + checkMarks.affected + keyResult.affected,
    }
  }

  public async deleteFromObjectiveID(objectiveId: string): Promise<DeleteResult> {
    const comments = await this.keyResultCommentProvider.deleteFromObjective(objectiveId)
    const checkIns = await this.keyResultCheckInProvider.deleteFromObjective(objectiveId)
    const checkMarks = await this.keyResultCheckMarkProvider.deleteFromObjective(objectiveId)
    const keyResults = await this.delete({
      objectiveId,
    })

    return {
      raw: [...comments.raw, ...checkIns.raw, ...checkMarks.raw, ...keyResults.raw],
      affected: comments.affected + checkIns.affected + checkMarks.affected + keyResults.affected,
    }
  }

  public async getWithRelationFilters(
    filters: KeyResultRelationFilterProperties,
    entityOrderAttributes?: EntityOrderAttributes[],
  ): Promise<KeyResult[]> {
    const orderAttributes = this.marshalEntityOrderAttributes(entityOrderAttributes)
    const cleanedRelationFilters = omitBy(
      {
        keyResultCheckIn: pickBy(filters.keyResultCheckIn, identity),
        keyResult: pickBy(filters.keyResult, identity),
        objective: pickBy(filters.objective, identity),
        cycle: pickBy(filters.cycle, identity),
        team: pickBy(filters.team, identity),
      },
      isEmpty,
    )
    const nullableFilters = {
      keyResultCheckIn: ['createdAt'],
    }

    return this.repository.findWithRelationFilters(
      cleanedRelationFilters,
      nullableFilters,
      orderAttributes,
    )
  }

  public async getProgressHistoryForKeyResultID(id: string): Promise<ProgressRecord[]> {
    const keyResult = await this.getFromID(id)
    const latestCheckIn = await this.keyResultCheckInProvider.getLatestFromKeyResult(keyResult)

    const history = await this.analyticsProvider.getWeeklyProgressHistoryForKeyResult(
      id,
      latestCheckIn,
      keyResult.createdAt,
    )

    return history
  }

  public async getOwnedByUserID(
    userID: string,
    filters?: KeyResultInterface,
  ): Promise<KeyResult[]> {
    const selector: Partial<KeyResultInterface> = {
      ...filters,
      ownerId: userID,
    }

    return this.getMany(selector)
  }

  public async getAllWithUserIDInSupportTeam(
    userID: string,
    filters?: KeyResultInterface,
  ): Promise<KeyResult[]> {
    return this.repository.getWithUserInSupportTeamWithFilters(userID, filters)
  }

  public async getByIdsWhoAreInActiveCycles(keyResultsIds: string[]): Promise<KeyResult[]> {
    return this.repository.find({
      relations: ['objective', 'objective.cycle'],
      where: {
        id: In(keyResultsIds),
        objective: {
          cycle: {
            active: true,
          },
        },
      },
    })
  }

  public getUniqueKeyResults(...lists: KeyResult[][]): KeyResult[] {
    const flattenedLists = flatten(lists)

    return uniqBy(flattenedLists, 'id')
  }

  public async getProgress(keyResult: KeyResult): Promise<number> {
    const latestCheckIn = await this.keyResultCheckInProvider.getLatestFromKeyResult(keyResult)
    const progress = await this.getCheckInProgress(latestCheckIn, keyResult)
    return progress
  }

  public async getProgressSum(keyResults: KeyResult[]): Promise<number> {
    const keyResultProgresses = await Promise.all(
      keyResults.map(async (keyResult) => this.getProgress(keyResult)),
    )

    const progressSum = keyResultProgresses.reduce(
      (progressSum, currentProgress) => progressSum + currentProgress,
      0,
    )

    return progressSum
  }

  protected async protectCreationQuery(
    _query: CreationQuery<KeyResult>,
    _data: Partial<KeyResultInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
