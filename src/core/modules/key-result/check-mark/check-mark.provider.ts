import { Injectable } from '@nestjs/common/decorators'
import { DeleteResult } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CreationQuery } from '@core/types/creation-query.type'

import { CheckMarkInterface, CheckMarkStates } from './check-mark.interface'
import { CheckMark } from './check-mark.orm-entity'
import { CheckMarkRepository } from './check-mark.repository'

@Injectable()
export class CheckMarkProvider extends CoreEntityProvider<CheckMark, CheckMarkInterface> {
  constructor(protected readonly repository: CheckMarkRepository) {
    super(CheckMarkProvider.name, repository)
  }

  public async createCheckMark(checkMark: Partial<CheckMarkInterface>): Promise<CheckMark[]> {
    return this.create(checkMark)
  }

  public async checkCheckMark(id: string): Promise<CheckMark> {
    return this.update({ id }, { state: CheckMarkStates.CHECKED })
  }

  public async uncheckCheckMark(id: string): Promise<CheckMark> {
    return this.update({ id }, { state: CheckMarkStates.UNCHECKED })
  }

  public async changeDescription(id: string, description: string): Promise<CheckMark> {
    return this.update({ id }, { description })
  }

  public async deleteAllOfKeyResult(keyResultId: string): Promise<DeleteResult> {
    return this.delete({ keyResultId })
  }

  protected async protectCreationQuery(query: CreationQuery<CheckMark>): Promise<CheckMark[]> {
    return query()
  }
}
