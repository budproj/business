import { Injectable } from '@nestjs/common'
import { ObjectLiteral } from 'typeorm'

import { CycleDTO } from 'domain/company-aggregate/cycle/dto'
import { User } from 'domain/user-aggregate/user/entities'

import { KeyResultViewDTO } from '../key-result-view/dto'

import { KeyResultDTO } from './dto'
import { KeyResult } from './entities'
import KeyResultRepository from './repository'

export interface KeyResultWithCycle extends KeyResult {
  cycle: CycleDTO
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

  async getRankedFromOwnerWithRelations(
    owner: User['id'],
    customRank: KeyResultViewDTO['rank'],
  ): Promise<KeyResult[]> {
    const selector: ObjectLiteral = { owner }
    const relations = this.allRelations
    const rankSortColumn = this.buildRankSortColumn(customRank)

    const keyResults = await this.repository.selectManyWithRankAndRelations(
      selector,
      rankSortColumn,
      relations,
    )

    return keyResults
  }

  buildRankSortColumn(customRank: KeyResultViewDTO['rank']): string {
    if (customRank.length === 0) return ''

    const prefix = '(CASE'
    const parts = customRank.map(
      (keyResultID: KeyResultDTO['id'], index: number) =>
        `WHEN ${KeyResult.name}.id=${keyResultID} THEN ${index}`,
    )
    const suffix = 'ELSE null END)'

    const rankSortColumn = [prefix, ...parts, suffix].join(' ')

    return rankSortColumn
  }
}

export default KeyResultService
