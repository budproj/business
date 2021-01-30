import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { filter, maxBy, minBy } from 'lodash'

import { CONSTRAINT } from 'src/domain/constants'
import {
  DomainCreationQuery,
  DomainEntityService,
  DomainQueryContext,
  DomainServiceGetOptions,
} from 'src/domain/entity'
import { KeyResultCheckInDTO } from 'src/domain/key-result/check-in/dto'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import DomainKeyResultCheckInService from 'src/domain/key-result/check-in/service'
import {
  DEFAULT_CONFIDENCE,
  DEFAULT_PERCENTAGE_PROGRESS,
  KEY_RESULT_FORMAT,
} from 'src/domain/key-result/constants'
import { KEY_RESULT_CUSTOM_LIST_BINDING } from 'src/domain/key-result/custom-list/constants'
import { KeyResultCustomListDTO } from 'src/domain/key-result/custom-list/dto'
import { KeyResultCustomList } from 'src/domain/key-result/custom-list/entities'
import DomainKeyResultCustomListService from 'src/domain/key-result/custom-list/service'
import { KeyResultDTO } from 'src/domain/key-result/dto'
import { ObjectiveDTO } from 'src/domain/objective/dto'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResult } from './entities'
import DomainKeyResultRepository from './repository'

export interface DomainKeyResultServiceInterface {
  customList: DomainKeyResultCustomListService
  checkIn: DomainKeyResultCheckInService

  getFromOwner: (owner: UserDTO) => Promise<KeyResult[]>
  getFromTeams: (teams: TeamDTO | TeamDTO[]) => Promise<KeyResult[]>
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
  getLatestCheckInForTeam: (team: TeamDTO) => Promise<KeyResultCheckIn | null>
  getCurrentProgressForKeyResult: (keyResult: KeyResultDTO) => Promise<KeyResultCheckIn['progress']>
  getCurrentConfidenceForKeyResult: (
    keyResult: KeyResultDTO,
  ) => Promise<KeyResultCheckIn['confidence']>
  buildCheckInGroupForKeyResultListAtDate: (
    date: Date,
    keyResults: KeyResult[],
  ) => Promise<DomainKeyResultCheckInGroup>
  buildDefaultCheckInGroup: (
    progress?: KeyResultCheckIn['progress'],
    confidence?: KeyResultCheckIn['confidence'],
  ) => DomainKeyResultCheckInGroup
  buildCheckInForUser: (
    user: UserDTO,
    checkInData: DomainKeyResultCheckInPayload,
  ) => Partial<KeyResultCheckInDTO>
}

export interface DomainKeyResultCheckInGroup {
  progress: KeyResultCheckInDTO['progress']
  confidence: KeyResultCheckInDTO['confidence']
  latestCheckIn?: KeyResultCheckInDTO
}

export interface DomainKeyResultCheckInPayload {
  progress: KeyResultCheckIn['progress']
  confidence: KeyResultCheckIn['confidence']
  keyResultId: KeyResultCheckIn['keyResultId']
  comment?: KeyResultCheckIn['comment']
}

@Injectable()
class DomainKeyResultService
  extends DomainEntityService<KeyResult, KeyResultDTO>
  implements DomainKeyResultServiceInterface {
  constructor(
    public readonly customList: DomainKeyResultCustomListService,
    @Inject(forwardRef(() => DomainKeyResultCheckInService))
    public readonly checkIn: DomainKeyResultCheckInService,
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
    filter?: Array<keyof KeyResult>,
  ): Promise<KeyResult[]> {
    const isEmptyArray = Array.isArray(teams) ? teams.length === 0 : false
    if (!teams || isEmptyArray) return

    const buildSelector = (teamId: TeamDTO['id']) => ({ teamId })
    const selector = Array.isArray(teams)
      ? teams.map((team) => buildSelector(team.id))
      : buildSelector(teams.id)

    return this.repository.find({ where: selector, select: filter })
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

  public async getLatestCheckInForTeam(team: TeamDTO) {
    const users = await this.teamService.getUsersInTeam(team)
    const latestCheckIn = await this.checkIn.getLatestFromUsers(users)

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

  public async buildCheckInGroupForKeyResultListAtDate(date: Date, keyResults: KeyResult[]) {
    const latestCheckInAtDatePromises = keyResults.map(async (keyResult) =>
      this.checkIn.getLatestFromKeyResultAtDate(keyResult, date),
    )
    const latestCheckInsAtDate = await Promise.all(latestCheckInAtDatePromises)
    const latestNotUndefinedCheckIns = filter(latestCheckInsAtDate)
    const latestCheckIn = maxBy(latestNotUndefinedCheckIns, (checkIn) => checkIn?.createdAt)

    const checkInGroup: DomainKeyResultCheckInGroup = {
      latestCheckIn,
      progress: this.calculateCheckInGroupAverageProgress(latestCheckInsAtDate, keyResults),
      confidence: this.getCheckInGroupLowestConfidenceValue(latestCheckInsAtDate),
    }

    return checkInGroup
  }

  public buildDefaultCheckInGroup(
    progress: KeyResultCheckIn['progress'] = DEFAULT_PERCENTAGE_PROGRESS,
    confidence: KeyResultCheckIn['confidence'] = DEFAULT_CONFIDENCE,
  ) {
    const defaultCheckInState: DomainKeyResultCheckInGroup = {
      progress,
      confidence,
    }

    return defaultCheckInState
  }

  public buildCheckInForUser(user: UserDTO, checkInData: DomainKeyResultCheckInPayload) {
    const checkIn: Partial<KeyResultCheckInDTO> = {
      userId: user.id,
      keyResultId: checkInData.keyResultId,
      progress: checkInData.progress,
      confidence: checkInData.confidence,
      comment: checkInData.comment,
    }

    return checkIn
  }

  protected async protectCreationQuery(
    _query: DomainCreationQuery<KeyResult>,
    _data: Partial<KeyResultDTO>,
    _queryContext: DomainQueryContext,
  ) {
    return []
  }

  private calculateCheckInGroupAverageProgress(
    latestCheckIns: KeyResultCheckIn[],
    keyResults: KeyResult[],
  ) {
    const normalizedCheckIns = latestCheckIns.map((checkIn, index) =>
      this.normalizeCheckInToPercentage(checkIn, keyResults[index]),
    )
    const checkInGroupAverageProgress = this.checkIn.calculateAverageProgressFromCheckInList(
      normalizedCheckIns,
    )

    return checkInGroupAverageProgress
  }

  private normalizeCheckInToPercentage(checkIn: KeyResultCheckIn, keyResult: KeyResult) {
    if (!checkIn) return
    if (keyResult.format === KEY_RESULT_FORMAT.PERCENTAGE) return checkIn

    const percentageCheckIn = this.checkIn.transformCheckInToPercentage(checkIn, keyResult)
    const percentageCheckInWithLimit = this.checkIn.limitPercentageCheckIn(percentageCheckIn)

    return percentageCheckInWithLimit
  }

  private getCheckInGroupLowestConfidenceValue(checkIns: KeyResultCheckIn[]) {
    const notUndefinedCheckIns = filter(checkIns)
    if (notUndefinedCheckIns.length === 0) return DEFAULT_CONFIDENCE

    const minConfidenceCheckIn = minBy(notUndefinedCheckIns, (checkIn) => checkIn.confidence)

    return minConfidenceCheckIn.confidence
  }
}

export default DomainKeyResultService
