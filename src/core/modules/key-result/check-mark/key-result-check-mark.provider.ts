import { Injectable } from '@nestjs/common/decorators'
import { Any, DeleteResult } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { Sorting } from '@core/enums/sorting'
import { CreationQuery } from '@core/types/creation-query.type'

import { KeyResultCheckMarkInterface, CheckMarkStates } from './key-result-check-mark.interface'
import { KeyResultCheckMark } from './key-result-check-mark.orm-entity'
import { KeyResultCheckMarkRepository } from './key-result-check-mark.repository'

@Injectable()
export class KeyResultCheckMarkProvider extends CoreEntityProvider<
  KeyResultCheckMark,
  KeyResultCheckMarkInterface
> {
  constructor(protected readonly repository: KeyResultCheckMarkRepository) {
    super(KeyResultCheckMarkProvider.name, repository)
  }

  public async createCheckMark(
    checkMark: Partial<KeyResultCheckMarkInterface>,
  ): Promise<KeyResultCheckMark[]> {
    return this.create(checkMark)
  }

  public async checkCheckMark(id: string): Promise<KeyResultCheckMark> {
    return this.update({ id }, { state: CheckMarkStates.CHECKED })
  }

  public async uncheckCheckMark(id: string): Promise<KeyResultCheckMark> {
    return this.update({ id }, { state: CheckMarkStates.UNCHECKED })
  }

  public async changeAssigned(id: string, userId: string): Promise<KeyResultCheckMark> {
    return this.update({ id }, { assignedUserId: userId })
  }

  public async changeDescription(id: string, description: string): Promise<KeyResultCheckMark> {
    return this.update({ id }, { description })
  }

  public async deleteAllOfKeyResult(keyResultId: string): Promise<DeleteResult> {
    return this.delete({ keyResultId })
  }

  public async getFromKeyResult(
    keyResultId: string,
    assignedUserId?: string,
  ): Promise<KeyResultCheckMark[]> {
    const options = { orderBy: { createdAt: Sorting.ASC } }

    const searchObject = assignedUserId ? { keyResultId, assignedUserId } : { keyResultId }

    return this.getMany(searchObject, undefined, options)
  }

  public async getFromAssignedUser(userId: string): Promise<KeyResultCheckMark[]> {
    return this.getMany({ assignedUserId: userId })
  }

  // TODO: tests
  public async getFromIndexes(
    indexes: Partial<KeyResultCheckMarkInterface>,
  ): Promise<KeyResultCheckMark> {
    return this.getOne(indexes)
  }

  public async deleteFromObjective(objectiveID: string): Promise<DeleteResult> {
    const objectiveCheckMarks = await this.repository.getFromObjective(objectiveID)
    const objectiveCheckMarkIDs = objectiveCheckMarks.map((checkMark) => checkMark.id)

    return this.delete({
      id: Any(objectiveCheckMarkIDs),
    })
  }

  protected async protectCreationQuery(
    query: CreationQuery<KeyResultCheckMark>,
  ): Promise<KeyResultCheckMark[]> {
    return query()
  }
}
