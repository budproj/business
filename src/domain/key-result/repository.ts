import { EntityRepository, Repository, SelectQueryBuilder } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CompanyDTO } from 'domain/company/dto'
import { KeyResultDTO } from 'domain/key-result/dto'
import { TeamDTO } from 'domain/team'
import { UserDTO } from 'domain/user'

import { KeyResult } from './entities'

@EntityRepository(KeyResult)
class DomainKeyResultRepository extends Repository<KeyResult> {
  async findByIDWithCompanyConstraint(
    id: KeyResultDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<KeyResult | null> {
    const query = this.createCompanyConstrainedQueryBuilder(allowedCompanies)
    const filteredQuery = query.andWhere(`${KeyResult.name}.id = (:id)`, { id })

    return filteredQuery.getOne()
  }

  async findByIDWithTeamConstraint(
    id: KeyResultDTO['id'],
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<KeyResult | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const teamConstrainedQuery = filteredQuery.andWhere(`${KeyResult.name}.teamId IN (:...teams)`, {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getOne()
  }

  async findByIDWithOwnsConstraint(
    id: KeyResultDTO['id'],
    userID: UserDTO['id'],
  ): Promise<KeyResult | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const ownerConstrainedQuery = filteredQuery.andWhere('owner_id = :userID', {
      userID,
    })

    return ownerConstrainedQuery.getOne()
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

  async updateByIDWithCompanyConstraint(
    id: KeyResultDTO['id'],
    newData: QueryDeepPartialEntity<KeyResult>,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<KeyResult | null> {
    console.log(id, newData, allowedCompanies)

    // Not implemented yet
  }

  async updateByIDWithTeamConstraint(
    id: KeyResultDTO['id'],
    newData: QueryDeepPartialEntity<KeyResult>,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<KeyResult | null> {
    console.log(id, newData, allowedTeams)

    // Not implemented yet
  }

  async updateByIDWithOwnsConstraint(
    id: KeyResultDTO['id'],
    newData: QueryDeepPartialEntity<KeyResult>,
    userID: UserDTO['id'],
  ): Promise<KeyResult | null> {
    console.log(id, newData, userID)

    // Not implemented yet
  }
}

export default DomainKeyResultRepository
