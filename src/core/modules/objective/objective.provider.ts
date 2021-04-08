import { Injectable } from '@nestjs/common'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { CycleInterface } from '@core/modules/cycle/cycle.interface'
import { UserInterface } from '@core/modules/user/user.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { ObjectiveInterface } from './objective.interface'
import { Objective } from './objective.orm-entity'
import { ObjectiveRepository } from './objective.repository'

@Injectable()
export class ObjectiveProvider extends CoreEntityProvider<Objective, ObjectiveInterface> {
  constructor(protected readonly repository: ObjectiveRepository) {
    super(ObjectiveProvider.name, repository)
  }

  public async getFromOwner(owner: UserInterface): Promise<Objective[]> {
    return this.repository.find({ ownerId: owner.id })
  }

  public async getFromCycle(cycle: CycleInterface): Promise<Objective[]> {
    return this.repository.find({ cycleId: cycle.id })
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Objective>,
    _data: Partial<ObjectiveInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
