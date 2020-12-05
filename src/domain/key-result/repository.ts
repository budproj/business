import { EntityRepository, SelectQueryBuilder } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import DomainEntityRepository from 'domain/repository'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class DomainKeyResultRepository extends DomainEntityRepository<KeyResult> {
  constraintQueryToCompany(allowedCompanies: Array<CompanyDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<KeyResult>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${KeyResult.name}.team`, 'team')
        .andWhere('team.companyId IN (:...allowedCompanies)', { allowedCompanies })

      return constrainedQuery
    }

    return addContraintToQuery
  }

  constraintQueryToTeam(allowedTeams: Array<TeamDTO['id']>) {
    const addContraintToQuery = (query?: SelectQueryBuilder<KeyResult>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery
        .leftJoinAndSelect(`${KeyResult.name}.team`, 'team')
        .andWhere('team.id IN (:...allowedTeams)', { allowedTeams })

      return constrainedQuery
    }

    return addContraintToQuery
  }

  constraintQueryToOwns(user: UserDTO) {
    const addContraintToQuery = (query?: SelectQueryBuilder<KeyResult>) => {
      const baseQuery = query ?? this.createQueryBuilder()
      const constrainedQuery = baseQuery.andWhere(`${KeyResult.name}.ownerId = :userID`, {
        userID: user.id,
      })

      return constrainedQuery
    }

    return addContraintToQuery
  }

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
}

export default DomainKeyResultRepository
