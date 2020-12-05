import { Logger } from '@nestjs/common'
import { EntityRepository, ObjectLiteral, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'
import { Team } from 'domain/team/entities'
import { UserDTO } from 'domain/user/dto'

import { User } from './entities'

@EntityRepository(User)
class DomainUserRepository extends Repository<User> {
  private readonly logger = new Logger(DomainUserRepository.name)

  async findRelatedTeams(selector: ObjectLiteral): Promise<Array<Partial<Team>> | null> {
    const query = this.createQueryBuilder()
      .where(selector)
      .leftJoinAndSelect(`${User.name}.teams`, 'teams')
      .select('teams.companyId AS "companyId", teams.id as "id"')
      .execute()

    const teams: Team[] = await query

    this.logger.debug({
      teams,
      selector,
      message: 'Found related teams for selector',
    })

    return teams
  }

  async updateByIDWithCompanyConstraint(
    id: UserDTO['id'],
    newData: QueryDeepPartialEntity<User>,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<User | null> {
    console.log(id, newData, allowedCompanies)

    return null // eslint-disable-line unicorn/no-null
  }

  async updateByIDWithTeamConstraint(
    id: UserDTO['id'],
    newData: QueryDeepPartialEntity<User>,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<User | null> {
    console.log(id, newData, allowedTeams)

    return null // eslint-disable-line unicorn/no-null
  }

  async updateByIDWithOwnsConstraint(
    id: UserDTO['id'],
    newData: QueryDeepPartialEntity<User>,
    userID: UserDTO['id'],
  ): Promise<User | null> {
    console.log(id, newData, userID)

    return null // eslint-disable-line unicorn/no-null
  }
}

export default DomainUserRepository
