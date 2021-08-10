import { Injectable } from '@nestjs/common/decorators'
import { LexoRank } from 'lexorank'
import { DeleteResult } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { Sorting } from '@core/enums/sorting'
import { CreationQuery } from '@core/types/creation-query.type'

import { KeyResultCheckMarkInterface, CheckMarkStates } from './key-result-check-mark.interface'
import { KeyResultCheckMark } from './key-result-check-mark.orm-entity'
import { KeyResultCheckMarkRepository } from './key-result-check-mark.repository'

interface LexoRankItem {
  id: string
  lexoRank: string
}

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
    const lastItem = await this.getOne(undefined, undefined, {
      orderBy: { lexoRank: Sorting.DESC },
    })

    const lexoRank = lastItem ? LexoRank.parse(lastItem.lexoRank).genNext() : LexoRank.middle()

    const newCheckMark = {
      ...checkMark,
      lexoRank: lexoRank.toString(),
    }

    return this.create(newCheckMark)
  }

  public async reorderCheckMark(item: LexoRankItem, previousItem: LexoRankItem, nextItem: LexoRankItem): Promise<KeyResultCcheckMark> {
  }

  public async checkCheckMark(id: string): Promise<KeyResultCheckMark> {
    return this.update({ id }, { state: CheckMarkStates.CHECKED })
  }

  public async uncheckCheckMark(id: string): Promise<KeyResultCheckMark> {
    return this.update({ id }, { state: CheckMarkStates.UNCHECKED })
  }

  public async changeDescription(id: string, description: string): Promise<KeyResultCheckMark> {
    return this.update({ id }, { description })
  }

  public async deleteAllOfKeyResult(keyResultId: string): Promise<DeleteResult> {
    return this.delete({ keyResultId })
  }

  public async getFromKeyResult(keyResultId: string): Promise<KeyResultCheckMark[]> {
    const options = { orderBy: { createdAt: Sorting.ASC } }
    return this.getMany({ keyResultId }, undefined, options)
  }

  // TODO: tests
  public async getFromIndexes(
    indexes: Partial<KeyResultCheckMarkInterface>,
  ): Promise<KeyResultCheckMark> {
    return this.getOne(indexes)
  }

  protected async protectCreationQuery(
    query: CreationQuery<KeyResultCheckMark>,
  ): Promise<KeyResultCheckMark[]> {
    return query()
  }
}
