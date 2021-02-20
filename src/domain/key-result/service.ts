import { forwardRef, Inject, Injectable } from '@nestjs/common'

import { CONSTRAINT } from 'src/domain/constants'
import {
  DomainCreationQuery,
  DomainEntityService,
  DomainQueryContext,
  DomainServiceGetOptions,
} from 'src/domain/entity'
import { KeyResultFilters } from 'src/domain/key-result/types'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultCheckInDTO } from './check-in/dto'
import { KeyResultCheckIn } from './check-in/entities'
import DomainKeyResultCheckInService from './check-in/service'
import { KeyResultCommentDTO } from './comment/dto'
import { KeyResultComment } from './comment/entities'
import DomainKeyResultCommentService from './comment/service'
import { DEFAULT_CONFIDENCE } from './constants'
import { KEY_RESULT_CUSTOM_LIST_BINDING } from './custom-list/constants'
import { KeyResultCustomListDTO } from './custom-list/dto'
import { KeyResultCustomList } from './custom-list/entities'
import DomainKeyResultCustomListService from './custom-list/service'
import { KeyResultDTO } from './dto'
import { KeyResult } from './entities'
import DomainKeyResultRepository from './repository'
import DomainKeyResultTimelineService, { DomainKeyResultTimelineGetOptions } from './timeline'

export interface DomainKeyResultServiceInterface {
  customList: DomainKeyResultCustomListService
  checkIn: DomainKeyResultCheckInService
  comment: DomainKeyResultCommentService
  timeline: DomainKeyResultTimelineService

  getFromOwner: (owner: UserDTO) => Promise<KeyResult[]>
  getFromTeams: (teams: TeamDTO | TeamDTO[], filters?: KeyResultFilters) => Promise<KeyResult[]>
  getFromObjective: (objective: ObjectiveDTO) => Promise<KeyResult[]>
  getFromCustomList: (keyResultCustomList: KeyResultCustomListDTO) => Promise<KeyResult[]>
  refreshCustomListWithOwnedKeyResults: (
    user: UserDTO,
    keyResultCustomList?: KeyResultCustomListDTO,
  ) => Promise<KeyResultCustomList>
  createCustomListForBinding: (
    binding: KEY_RESULT_CUSTOM_LIST_BINDING,
    user: UserDTO,
  ) => Promise<KeyResultCustomList>
  getUserCustomLists: (user: UserDTO) => Promise<KeyResultCustomList[]>
  getCheckIns: (
    keyResult: KeyResultDTO,
    options?: DomainServiceGetOptions<KeyResultCheckIn>,
  ) => Promise<KeyResultCheckIn[] | null>
  getCheckInsByUser: (user: UserDTO) => Promise<KeyResultCheckIn[] | null>
  getLatestCheckInForTeam: (
    team: TeamDTO,
    filters?: KeyResultFilters,
  ) => Promise<KeyResultCheckIn | null>
  getLatestCheckInForKeyResultAtDate: (
    team: KeyResultDTO,
    date?: Date,
  ) => Promise<KeyResultCheckIn | null>
  getCurrentProgressForKeyResult: (keyResult: KeyResultDTO) => Promise<KeyResultCheckIn['progress']>
  getCurrentConfidenceForKeyResult: (
    keyResult: KeyResultDTO,
  ) => Promise<KeyResultCheckIn['confidence']>
  buildCheckInForUser: (
    user: UserDTO,
    checkInData: DomainKeyResultCheckInPayload,
  ) => Promise<Partial<KeyResultCheckInDTO>>
  getParentCheckInFromCheckIn: (checkIn: KeyResultCheckInDTO) => Promise<KeyResultCheckIn | null>
  getCheckInValueIncrease: (checkIn: KeyResultCheckIn) => Promise<number>
  getCheckInProgressIncrease: (checkIn: KeyResultCheckIn) => Promise<number>
  getCheckInConfidenceIncrease: (checkIn: KeyResultCheckIn) => Promise<number>
  getCheckInProgress: (checkIn: KeyResultCheckIn) => Promise<number>
  buildCommentForUser: (
    user: UserDTO,
    commentData: DomainKeyResultCommentPayload,
  ) => Promise<Partial<KeyResultCheckInDTO>>
  getComments: (
    keyResult: KeyResultDTO,
    options?: DomainServiceGetOptions<KeyResultComment>,
  ) => Promise<KeyResultComment[] | null>
  getTimeline: (
    keyResult: KeyResultDTO,
    options: DomainKeyResultTimelineGetOptions,
  ) => Promise<Array<KeyResultCheckIn | KeyResultComment>>
  calculateKeyResultCheckInListAverageProgress: (
    keyResultCheckInList: KeyResultCheckIn[],
    keyResults: KeyResult[],
  ) => number
}

export interface DomainKeyResultStatus {
  progress: KeyResultCheckInDTO['progress']
  confidence: KeyResultCheckInDTO['confidence']
  createdAt: KeyResultCheckInDTO['createdAt']
}

export interface DomainKeyResultCheckInPayload {
  progress: KeyResultCheckIn['progress']
  confidence: KeyResultCheckIn['confidence']
  keyResultId: KeyResultCheckIn['keyResultId']
  comment?: KeyResultCheckIn['comment']
}

export interface DomainKeyResultCommentPayload {
  text: KeyResultComment['text']
  keyResultId: KeyResultComment['keyResultId']
}

@Injectable()
class DomainKeyResultService
  extends DomainEntityService<KeyResult, KeyResultDTO>
  implements DomainKeyResultServiceInterface {
  constructor(
    public readonly customList: DomainKeyResultCustomListService,
    @Inject(forwardRef(() => DomainKeyResultCheckInService))
    public readonly checkIn: DomainKeyResultCheckInService,
    @Inject(forwardRef(() => DomainKeyResultCommentService))
    public readonly comment: DomainKeyResultCommentService,
    @Inject(forwardRef(() => DomainKeyResultTimelineService))
    public readonly timeline: DomainKeyResultTimelineService,
    protected readonly repository: DomainKeyResultRepository,
    @Inject(forwardRef(() => DomainTeamService))
    private readonly teamService: DomainTeamService,
  ) {
    super(DomainKeyResultService.name, repository)
  }

  public async getFromOwner(owner: UserDTO) {
    return this.repository.find({ ownerId: owner.id })
  }

  public async getFromTeams(
    teams: TeamDTO | TeamDTO[],
    filters?: KeyResultFilters,
  ): Promise<KeyResult[]> {
    const isEmptyArray = Array.isArray(teams) ? teams.length === 0 : false
    if (!teams || isEmptyArray) return

    const teamsArray = Array.isArray(teams) ? teams : [teams]

    const teamsFilters = {
      teamIDs: teamsArray.map((team) => team.id),
      ...filters,
    }

    return this.repository.findWithFilters(teamsFilters)
  }

  public async getFromObjective(objective: ObjectiveDTO) {
    return this.repository.find({ objectiveId: objective.id })
  }

  public async getFromCustomList(keyResultCustomList: KeyResultCustomListDTO) {
    const rankSortColumn = this.repository.buildRankSortColumn(keyResultCustomList.rank)
    const data = this.repository.findByIdsRanked(keyResultCustomList.rank, rankSortColumn)

    return data
  }

  public async refreshCustomListWithOwnedKeyResults(
    user: UserDTO,
    keyResultCustomList?: KeyResultCustomListDTO,
  ) {
    const availableKeyResults = await this.getFromOwner(user)
    const refreshedCustomList = await this.customList.refreshWithNewKeyResults(
      availableKeyResults,
      keyResultCustomList,
    )

    return refreshedCustomList
  }

  public async createCustomListForBinding(binding: KEY_RESULT_CUSTOM_LIST_BINDING, user: UserDTO) {
    const bindingContextBuilders = {
      [KEY_RESULT_CUSTOM_LIST_BINDING.MINE]: async () =>
        this.teamService.buildTeamQueryContext(user, CONSTRAINT.OWNS),
    }

    const contextBuilder = bindingContextBuilders[binding]
    const context = await contextBuilder()

    const bindingKeyResults = await this.getManyWithConstraint({}, context)
    const createdCustomList = await this.customList.createForBinding(
      binding,
      user,
      bindingKeyResults,
    )

    const customList = await this.customList.getOne({ id: createdCustomList.id })

    return customList
  }

  public async getUserCustomLists(user: UserDTO) {
    const customLists = await this.customList.getFromUser(user)

    return customLists
  }

  public async getCheckIns(
    keyResult: KeyResultDTO,
    options?: DomainServiceGetOptions<KeyResultCheckIn>,
  ) {
    const selector = { keyResultId: keyResult.id }

    return this.checkIn.getMany(selector, undefined, options)
  }

  public async getCheckInsByUser(user: UserDTO) {
    const selector = { userId: user.id }

    return this.checkIn.getMany(selector)
  }

  public async getLatestCheckInForTeam(team: TeamDTO, filters?: KeyResultFilters) {
    const users = await this.teamService.getUsersInTeam(team)
    const latestCheckIn = await this.checkIn.getLatestFromUsers(users, filters)

    return latestCheckIn
  }

  public async getLatestCheckInForKeyResultAtDate(keyResult: KeyResultDTO, date?: Date) {
    date ??= new Date()
    const latestCheckIn = await this.checkIn.getLatestFromKeyResultAtDate(keyResult, date)

    return latestCheckIn
  }

  public async getCurrentProgressForKeyResult(keyResult: KeyResultDTO) {
    const latestCheckIn = await this.checkIn.getLatestFromKeyResult(keyResult)
    if (!latestCheckIn) return this.repository.getInitialValueForKeyResult(keyResult)

    return latestCheckIn.progress
  }

  public async getCurrentConfidenceForKeyResult(keyResult: KeyResultDTO) {
    const latestCheckIn = await this.checkIn.getLatestFromKeyResult(keyResult)
    if (!latestCheckIn) return DEFAULT_CONFIDENCE

    return latestCheckIn.confidence
  }

  public async buildCheckInForUser(user: UserDTO, checkInData: DomainKeyResultCheckInPayload) {
    const keyResult = await this.getOne({ id: checkInData.keyResultId })
    const previousCheckIn = await this.checkIn.getLatestFromKeyResult(keyResult)

    const checkIn: Partial<KeyResultCheckInDTO> = {
      userId: user.id,
      keyResultId: checkInData.keyResultId,
      progress: checkInData.progress,
      confidence: checkInData.confidence,
      comment: checkInData.comment,
      parentId: previousCheckIn?.id,
    }

    return checkIn
  }

  public async getParentCheckInFromCheckIn(checkIn: KeyResultCheckInDTO) {
    return this.checkIn.getOne({ id: checkIn.parentId })
  }

  public async getCheckInValueIncrease(checkIn: KeyResultCheckIn) {
    const keyResult = await this.getOne({ id: checkIn.keyResultId })
    const previousCheckIn = await this.getParentCheckInFromCheckIn(checkIn)
    if (!previousCheckIn) return checkIn.progress - keyResult.initialValue

    const deltaValue = checkIn.progress - previousCheckIn.progress

    return deltaValue
  }

  public async getCheckInProgressIncrease(checkIn: KeyResultCheckIn) {
    const keyResult = await this.getOne({ id: checkIn.keyResultId })
    const previousCheckIn = await this.getParentCheckInFromCheckIn(checkIn)

    const normalizedCurrentCheckIn = this.checkIn.transformCheckInToRelativePercentage(
      keyResult,
      checkIn,
    )
    if (!previousCheckIn) return normalizedCurrentCheckIn.progress

    const normalizedPreviousCheckIn = this.checkIn.transformCheckInToRelativePercentage(
      keyResult,
      previousCheckIn,
    )

    const deltaProgress = this.checkIn.calculateProgressDifference(
      normalizedPreviousCheckIn,
      normalizedCurrentCheckIn,
    )

    return deltaProgress
  }

  public async getCheckInConfidenceIncrease(checkIn: KeyResultCheckIn) {
    const previousCheckIn = await this.getParentCheckInFromCheckIn(checkIn)

    const deltaConfidence = this.checkIn.calculateConfidenceDifference(previousCheckIn, checkIn)

    return deltaConfidence
  }

  public async getCheckInProgress(checkIn: KeyResultCheckIn) {
    const keyResult = await this.getOne({ id: checkIn.keyResultId })
    const normalizedCheckIn = this.checkIn.transformCheckInToRelativePercentage(keyResult, checkIn)

    return normalizedCheckIn.progress
  }

  public async buildCommentForUser(user: UserDTO, commentData: DomainKeyResultCommentPayload) {
    const comment: Partial<KeyResultCommentDTO> = {
      text: commentData.text,
      userId: user.id,
      keyResultId: commentData.keyResultId,
    }

    return comment
  }

  public async getComments(
    keyResult: KeyResultDTO,
    options?: DomainServiceGetOptions<KeyResultComment>,
  ) {
    const selector = { keyResultId: keyResult.id }

    return this.comment.getMany(selector, undefined, options)
  }

  public async getTimeline(keyResult: KeyResultDTO, options: DomainKeyResultTimelineGetOptions) {
    const timelineOrder = await this.timeline.buildUnionQuery(keyResult, options)
    const timelineEntries = await this.timeline.getEntriesForTimelineOrder(timelineOrder)

    return timelineEntries
  }

  public calculateKeyResultCheckInListAverageProgress(
    keyResultCheckInList: KeyResultCheckIn[],
    keyResults: KeyResult[],
  ) {
    const normalizedKeyResultCheckInList = keyResultCheckInList.map((keyResultCheckIn, index) =>
      this.normalizeCheckInToPercentage(keyResults[index], keyResultCheckIn),
    )
    const keyResultCheckInListAverageProgress = this.checkIn.calculateAverageProgressFromCheckInList(
      normalizedKeyResultCheckInList,
    )

    return keyResultCheckInListAverageProgress
  }

  protected async protectCreationQuery(
    _query: DomainCreationQuery<KeyResult>,
    _data: Partial<KeyResultDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
  }

  private normalizeCheckInToPercentage(keyResult: KeyResult, checkIn?: KeyResultCheckIn) {
    const percentageCheckIn = this.checkIn.transformCheckInToRelativePercentage(keyResult, checkIn)
    const percentageCheckInWithLimit = this.checkIn.limitPercentageCheckIn(percentageCheckIn)

    return percentageCheckInWithLimit
  }
}

export default DomainKeyResultService
