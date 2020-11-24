import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
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

  async findByIdsRanked(ids: Array<KeyResultDTO['id']>, rank: string): Promise<KeyResult[]> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where('id IN (:...ids)', { ids })
    const orderedQuery = filteredQuery.orderBy(rank)

    return orderedQuery.getMany()
  }

  async findByIDWithCompanyConstraint(
    id: KeyResultDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<KeyResult | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = filteredQuery.leftJoinAndSelect(`${KeyResult.name}.team`, 'team')
    const companyConstrainedQuery = joinedQuery.andWhere('team.companyId IN (:...companies)', {
      companies: allowedCompanies,
    })

    return companyConstrainedQuery.getOne()
  }
}

export default KeyResultRepository
