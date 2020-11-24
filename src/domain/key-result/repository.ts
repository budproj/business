import { EntityRepository, Repository } from 'typeorm'

import { KeyResultDTO } from 'domain/key-result/dto'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class KeyResultRepository extends Repository<KeyResult> {
  buildRankSortColumn(rank: Array<KeyResultDTO['id']>): string {
    if (rank.length === 0) return ''

    const prefix = '(CASE'
    const parts = rank.map(
      (keyResultID: KeyResultDTO['id'], index: number) =>
        `WHEN ${KeyResult.name}.id=${keyResultID} THEN ${index}`,
    )
    const suffix = 'ELSE null END)'

    const rankSortColumn = [prefix, ...parts, suffix].join(' ')

    return rankSortColumn
  }
}

export default KeyResultRepository
