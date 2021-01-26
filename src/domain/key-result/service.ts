import { Injectable } from '@nestjs/common'

import { CONSTRAINT } from 'src/domain/constants'
import { DomainEntityService, DomainQueryContext, DomainServiceGetOptions } from 'src/domain/entity'
import { KeyResultCheckIn } from 'src/domain/key-result/check-in/entities'
import DomainKeyResultCheckInService from 'src/domain/key-result/check-in/service'
import { DEFAULT_CONFIDENCE } from 'src/domain/key-result/constants'
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
  repository: DomainKeyResultRepository
  customList: DomainKeyResultCustomListService
  checkIn: DomainKeyResultCheckInService

  getFromOwner: (ownerId: UserDTO['id']) => Promise<KeyResult[]>
  getFromTeam: (teamIDs: TeamDTO['id'] | Array<TeamDTO['id']>) => Promise<KeyResult[]>
  getFromObjective: (objectiveId: ObjectiveDTO['id']) => Promise<KeyResult[]>
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
}

@Injectable()
class DomainKeyResultService
  extends DomainEntityService<KeyResult, KeyResultDTO>
  implements DomainKeyResultServiceInterface {
  constructor(
    public readonly repository: DomainKeyResultRepository,
    public readonly customList: DomainKeyResultCustomListService,
    public readonly checkIn: DomainKeyResultCheckInService,
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainKeyResultService.name)
  }

  public async getFromOwner(ownerId: UserDTO['id']) {
    return this.repository.find({ ownerId })
  }

  public async getFromTeam(
    teamIDs: TeamDTO['id'] | Array<TeamDTO['id']>,
    filter?: Array<keyof KeyResult>,
  ): Promise<KeyResult[]> {
    const isEmptyArray = Array.isArray(teamIDs) ? teamIDs.length === 0 : false
    if (!teamIDs || isEmptyArray) return

    const buildSelector = (teamId: TeamDTO['id']) => ({ teamId })
    const selector = Array.isArray(teamIDs)
      ? teamIDs.map((teamID) => buildSelector(teamID))
      : buildSelector(teamIDs)

    return this.repository.find({ where: selector, select: filter })
  }

  public async getFromObjective(objectiveId: ObjectiveDTO['id']): Promise<KeyResult[]> {
    return this.repository.find({ objectiveId })
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
    const availableKeyResults = await this.getFromOwner(user.id)
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
    const users = await this.teamService.getUsersInTeam(team.id)
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

  protected async createIfUserIsInCompany(
    _data: Partial<KeyResult>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserIsInTeam(
    _data: Partial<KeyResult>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserOwnsIt(_data: Partial<KeyResult>, _queryContext: DomainQueryContext) {
    return {} as any
  }
  //
  // async getProgressInPercentage(
  //   id: KeyResultDTO['id'],
  //   timeframeScope: TIMEFRAME_SCOPE,
  // ): Promise<ProgressReport['valueNew']> {
  //   const progressTimeframedSelectors = {
  //     [TIMEFRAME_SCOPE.CURRENT]: async () => this.getCurrentProgress(id),
  //     [TIMEFRAME_SCOPE.SNAPSHOT]: async () => this.getSnapshotProgress(id),
  //   }
  //
  //   const timeframeSelector = progressTimeframedSelectors[timeframeScope]
  //   const currentProgress = await timeframeSelector()
  //   if (!currentProgress) return DEFAULT_PROGRESS
  //
  //   const { goal, initialValue } = await this.repository.findOne({ id })
  //   const currentProgressInPercentage =
  //     ((currentProgress - initialValue) * 100) / (goal - initialValue)
  //
  //   return currentProgressInPercentage
  // }
  //
  // async getSnapshotProgress(id: KeyResultDTO['id']): Promise<ProgressReport['valueNew']> {
  //   const latestProgressReport = await this.report.progress.getLatestFromSnapshotForKeyResult(id)
  //   if (!latestProgressReport) return DEFAULT_PROGRESS
  //
  //   return latestProgressReport.valueNew
  // }
  //
  //
  // async getCurrentConfidence(id: KeyResultDTO['id']): Promise<ConfidenceReport['valueNew']> {
  //   const latestConfidenceReport = await this.report.confidence.getLatestFromKeyResult(id)
  //   if (!latestConfidenceReport) return DEFAULT_CONFIDENCE
  //
  //   return latestConfidenceReport.valueNew
  // }
  //
  // async calculateAverageProgressFromList(
  //   keyResults: KeyResult[],
  //   timeframeScope: TIMEFRAME_SCOPE = TIMEFRAME_SCOPE.CURRENT,
  // ) {
  //   const currentProgressList = await Promise.all(
  //     keyResults.map(async ({ id }) => this.getProgressInPercentage(id, timeframeScope)),
  //   )
  //   const currentProgress = sum(currentProgressList) / currentProgressList.length
  //
  //   const normalizedCurrentProgress = Number.isNaN(currentProgress) ? 0 : currentProgress
  //
  //   return normalizedCurrentProgress
  // }
  //
  // async calculateCurrentAverageProgressFromList(keyResults: KeyResult[]) {
  //   const calculatedCurrentProgress = this.calculateAverageProgressFromList(keyResults)
  //
  //   return calculatedCurrentProgress
  // }
  //
  // async calculateSnapshotAverageProgressFromList(keyResults: KeyResult[]) {
  //   const calculatedSnapshotProgress = this.calculateAverageProgressFromList(
  //     keyResults,
  //     TIMEFRAME_SCOPE.SNAPSHOT,
  //   )
  //
  //   return calculatedSnapshotProgress
  // }
  //
  // async getLowestConfidenceFromList(keyResults: KeyResult[]) {
  //   const DEFAULT_CONFIDENCE = 100
  //   const currentConfidenceList = await Promise.all(
  //     keyResults.map(async ({ id }) => this.getCurrentConfidence(id)),
  //   )
  //   const minConfidence = min(currentConfidenceList)
  //
  //   return minConfidence ?? DEFAULT_CONFIDENCE
  // }
  //
  // async getReports(keyResultID: KeyResult['id']) {
  //   const progressReports = await this.report.progress.getFromKeyResult(keyResultID)
  //   const confidenceReports = await this.report.confidence.getFromKeyResult(keyResultID)
  //
  //   const mergedReports = [...progressReports, ...confidenceReports]
  //   const uniqueReports = uniqBy(mergedReports, 'comment')
  //
  //   return uniqueReports
  // }
  //
  // async getOneReportWithConstraint(
  //   constraint: CONSTRAINT,
  //   selector: FindConditions<ProgressReport>,
  //   user: UserDTO,
  // ) {
  //   const progressReport = await this.report.progress.getOneWithConstraint(
  //     constraint,
  //     selector,
  //     user,
  //   )
  //   const confidenceReport = await this.report.confidence.getOneWithConstraint(
  //     constraint,
  //     selector,
  //     user,
  //   )
  //
  //   const report = remove([progressReport, confidenceReport])[0]
  //
  //   return report
  // }
  //
}

export default DomainKeyResultService
