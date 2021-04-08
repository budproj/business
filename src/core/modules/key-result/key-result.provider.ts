import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { flatten, uniqBy } from 'lodash'
import { Any } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { TeamProvider } from '@core/modules/team/team.provider'
import { CreationQuery } from '@core/types/creation-query.type'

import { ObjectiveInterface } from '../objective/objective.interface'
import { TeamInterface } from '../team/team.interface'
import { UserInterface } from '../user/user.interface'

import { KeyResultInterface } from './key-result.interface'
import { KeyResult } from './key-result.orm-entity'
import { KeyResultRepository } from './key-result.repository'

@Injectable()
export class KeyResultProvider extends CoreEntityProvider<KeyResult, KeyResultInterface> {
  constructor(
    protected readonly repository: KeyResultRepository,
    @Inject(forwardRef(() => TeamProvider))
    private readonly teamProvider: TeamProvider,
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
    filter?: Partial<KeyResultInterface>,
  ) {
    return this.repository.find({
      ...filter,
      objectiveId: objective.id,
    })
  }

  public async getFromObjectives(
    objectives: ObjectiveInterface[],
    filter?: Partial<KeyResultInterface>,
  ) {
    const keyResultPromises = objectives.map(async (objective) =>
      this.getFromObjective(objective, filter),
    )
    const keyResults = await Promise.all(keyResultPromises)

    const flattenedKeyResults = flatten(keyResults)
    const uniqueKeyResults = uniqBy(flattenedKeyResults, 'id')

    return uniqueKeyResults
  }

  protected async protectCreationQuery(
    _query: CreationQuery<KeyResult>,
    _data: Partial<KeyResultInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
