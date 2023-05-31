import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { Any, DeleteResult } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { Sorting } from '@core/enums/sorting'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { CreationQuery } from '@core/types/creation-query.type'

import { KeyResultProvider } from '../key-result.provider'

import { KeyResultUpdateInterface } from './key-result-update.interface'
import { KeyResultUpdate } from './key-result-update.orm-entity'
import { KeyResultUpdateRepository } from './key-result-update.repository'

@Injectable()
export class KeyResultUpdateProvider extends CoreEntityProvider<
  KeyResultUpdate,
  KeyResultUpdateInterface
> {
  private keyResultProvider: KeyResultProvider

  constructor(
    protected readonly repository: KeyResultUpdateRepository,
    private readonly moduleReference: ModuleRef,
  ) {
    super(KeyResultUpdateProvider.name, repository)
  }

  public async createUpdate(update: Partial<KeyResultUpdateInterface>): Promise<KeyResultUpdate[]> {
    return this.create(update)
  }

  public async getFromKeyResult(keyResultId: string): Promise<KeyResultUpdate[]> {
    const options = { orderBy: { createdAt: Sorting.DESC } }

    const searchObject = { keyResultId }

    return this.getMany(searchObject, undefined, options)
  }

  public async deleteFromObjective(objectiveID: string): Promise<DeleteResult> {
    const objectiveUpdates = await this.repository.getFromObjective(objectiveID)
    const objectiveUpdatesIDs = objectiveUpdates.map((update) => update.id)

    return this.delete({
      id: Any(objectiveUpdatesIDs),
    })
  }

  public async getFromIndexes(
    indexes: Partial<KeyResultUpdateInterface>,
  ): Promise<KeyResultUpdate> {
    return this.getOne(indexes)
  }

  protected onModuleInit(): void {
    this.keyResultProvider = this.moduleReference.get(KeyResultProvider)
  }

  protected async protectCreationQuery(
    query: CreationQuery<KeyResultUpdate>,
    data: Partial<KeyResultUpdateInterface>,
    queryContext: CoreQueryContext,
  ): Promise<KeyResultUpdate[]> {
    const selector = { id: data.keyResultId }

    const validationData = await this.keyResultProvider.getOneWithConstraint(selector, queryContext)

    if (!validationData) return

    return query()
  }
}
