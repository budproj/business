import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { KeyResultDTO } from 'domain/key-result/dto'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class DomainKeyResultRepository extends Repository<KeyResult> {
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

  createCompanyConstrainedQueryBuilder(
    allowedCompanies: Array<CompanyDTO['id']>,
  ): SelectQueryBuilder<KeyResult> {
    const query = super.createQueryBuilder()
    const joinedQuery = query.leftJoinAndSelect(`${KeyResult.name}.team`, 'team')
    const companyConstrainedQuery = joinedQuery.where('team.companyId IN (:...companies)', {
      companies: allowedCompanies,
    })

    return companyConstrainedQuery
  }

  async findByIdsRankedWithCompanyConstraint(
    ids: Array<KeyResultDTO['id']>,
    rank: string,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<KeyResult[]> {
    const query = this.createCompanyConstrainedQueryBuilder(allowedCompanies)
    const filteredQuery = query.andWhere(`${KeyResult.name}.id IN (:...ids)`, { ids })
    const orderedQuery = filteredQuery.orderBy(rank)

    return orderedQuery.getMany()
  }

  async findByIDWithCompanyConstraint(
    id: KeyResultDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<KeyResult | null> {
    const query = this.createCompanyConstrainedQueryBuilder(allowedCompanies)
    const filteredQuery = query.andWhere(`${KeyResult.name}.id = (:id)`, { id })

    return filteredQuery.getOne()
  }
}

export default DomainKeyResultRepository
