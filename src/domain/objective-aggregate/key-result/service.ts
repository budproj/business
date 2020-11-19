import { Injectable } from '@nestjs/common'
import { ObjectLiteral } from 'typeorm'

import { ICycle } from 'domain/company-aggregate/cycle/dto'
import { User } from 'domain/user-aggregate/user/entities'

import { KeyResult } from './entities'
import KeyResultRepository from './repository'

export interface KeyResultWithCycle extends KeyResult {
  cycle: ICycle
}

@Injectable()
class KeyResultService {
  allRelations: Array<[string, string] | string>

  constructor(private readonly repository: KeyResultRepository) {
    this.allRelations = [
      ['owner', 'user'],
      'team',
      'objective',
      'progressReports',
      'confidenceReports',
    ]
  }

  async getFromOwnerWithRelations(owner: User['id']): Promise<KeyResult[]> {
    const selector: ObjectLiteral = { owner }
    const relations = this.allRelations

    const keyResults = await this.repository.selectManyWithSelectorAndRelations(selector, relations)

    return keyResults
  }
}

export default KeyResultService
