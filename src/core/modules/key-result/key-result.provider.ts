import { Injectable } from '@nestjs/common'
import { uniqBy } from 'lodash'
import { Any } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { GetOptions } from '@core/interfaces/get-options'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { TeamInterface } from '@core/modules/team/team.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { KeyResultInterface } from './key-result.interface'
import { KeyResult } from './key-result.orm-entity'
import { KeyResultRepository } from './key-result.repository'
import { KeyResultCheckIn } from './modules/check-in/key-result-check-in.orm-entity'
import { KeyResultCheckInProvider } from './modules/check-in/key-result-check-in.provider'
import { KeyResultComment } from './modules/comment/key-result-comment.orm-entity'
import { KeyResultCommentProvider } from './modules/comment/key-result-comment.provider'

@Injectable()
export class KeyResultProvider extends CoreEntityProvider<KeyResult, KeyResultInterface> {
  constructor(
    public readonly keyResultCommentProvider: KeyResultCommentProvider,
    public readonly keyResultCheckInProvider: KeyResultCheckInProvider,
    protected readonly repository: KeyResultRepository,
  ) {
    super(KeyResultProvider.name, repository)
  }

  public async getFromOwner(owner: UserInterface): Promise<KeyResult[]> {
    return this.repository.find({ ownerId: owner.id })
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

  public async getCheckInsByUser(user: UserInterface): Promise<KeyResultCheckIn[]> {
    const selector = { userId: user.id }

    return this.keyResultCheckInProvider.getMany(selector)
  }

  protected async protectCreationQuery(
    _query: CreationQuery<KeyResult>,
    _data: Partial<KeyResultInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
