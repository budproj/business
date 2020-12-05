import { EntityRepository, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CompanyDTO } from 'domain/company/dto'
import { CycleDTO } from 'domain/cycle/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'

import { Cycle } from './entities'

@EntityRepository(Cycle)
class DomainCycleRepository extends Repository<Cycle> {
  async findByIDWithCompanyConstraint(
    id: CycleDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Cycle | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const companyConstrainedQuery = filteredQuery.andWhere(
      `${Cycle.name}.companyId IN (:...companies)`,
      {
        companies: allowedCompanies,
      },
    )

    return companyConstrainedQuery.getOne()
  }

  async findByIDWithTeamConstraint(
    id: CycleDTO['id'],
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<Cycle | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedCompanyQuery = filteredQuery.leftJoinAndSelect(`${Cycle.name}.company`, 'company')
    const joinedTeamQuery = joinedCompanyQuery.innerJoin(
      'company.teams',
      'team',
      `team.id IN (:...teams)`,
      {
        teams: allowedTeams,
      },
    )

    return joinedTeamQuery.getOne()
  }

  async findByIDWithOwnsConstraint(
    id: CycleDTO['id'],
    userID: UserDTO['id'],
  ): Promise<Cycle | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedQuery = filteredQuery.leftJoinAndSelect(`${Cycle.name}.company`, 'company')
    const teamConstrainedQuery = joinedQuery.andWhere('company.owner_id = :userID', {
      userID,
    })

    return teamConstrainedQuery.getOne()
  }

  async updateByIDWithCompanyConstraint(
    id: CycleDTO['id'],
    newData: QueryDeepPartialEntity<Cycle>,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<Cycle | null> {
    console.log(id, newData, allowedCompanies)

    return null // eslint-disable-line unicorn/no-null
  }

  async updateByIDWithTeamConstraint(
    id: CycleDTO['id'],
    newData: QueryDeepPartialEntity<Cycle>,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<Cycle | null> {
    console.log(id, newData, allowedTeams)

    return null // eslint-disable-line unicorn/no-null
  }

  async updateByIDWithOwnsConstraint(
    id: CycleDTO['id'],
    newData: QueryDeepPartialEntity<Cycle>,
    userID: UserDTO['id'],
  ): Promise<Cycle | null> {
    console.log(id, newData, userID)

    return null // eslint-disable-line unicorn/no-null
  }
}

export default DomainCycleRepository
