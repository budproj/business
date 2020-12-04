import { EntityRepository, Repository } from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'
import { User } from 'domain/user/entities'
import { KeyResultViewDTO } from 'domain/user/view/key-result/dto'
import { KeyResultViewBinding } from 'domain/user/view/key-result/types'

import { KeyResultView } from './entities'

@EntityRepository(KeyResultView)
class DomainKeyResultViewRepository extends Repository<KeyResultView> {
  async findByIDWithCompanyConstraint(
    id: KeyResultViewDTO['id'],
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<KeyResultView | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedUserQuery = filteredQuery.leftJoinAndSelect(`${KeyResultView.name}.user`, 'user')
    const joinedTeamQuery = joinedUserQuery.leftJoinAndSelect('user.teams', 'teams')
    const companyConstrainedQuery = joinedTeamQuery.andWhere('teams.companyId IN (:...companies)', {
      companies: allowedCompanies,
    })

    return companyConstrainedQuery.getOne()
  }

  async findByIDWithTeamConstraint(
    id: KeyResultViewDTO['id'],
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<KeyResultView | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const joinedUserQuery = filteredQuery.leftJoinAndSelect(`${KeyResultView.name}.user`, 'user')
    const teamConstrainedQuery = joinedUserQuery.andWhere('user.teams IN (:...teams)', {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getOne()
  }

  async findByIDWithOwnsConstraint(
    id: KeyResultViewDTO['id'],
    userID: UserDTO['id'],
  ): Promise<KeyResultView | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ id })
    const ownerConstrainedQuery = filteredQuery.andWhere(`${KeyResultView.name}.userId = :userID`, {
      userID,
    })

    return ownerConstrainedQuery.getOne()
  }

  async findByBindingWithCompanyConstraint(
    binding: KeyResultViewBinding,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<KeyResultView[] | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ binding })
    const joinedUserQuery = filteredQuery.leftJoinAndSelect(`${KeyResultView.name}.user`, 'user')
    const joinedTeamQuery = joinedUserQuery.leftJoinAndSelect('user.teams', 'teams')
    const companyConstrainedQuery = joinedTeamQuery.andWhere('teams.companyId IN (:...companies)', {
      companies: allowedCompanies,
    })

    return companyConstrainedQuery.getMany()
  }

  async findByBindingWithTeamConstraint(
    binding: KeyResultViewBinding,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<KeyResultView[] | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ binding })
    const joinedUserQuery = filteredQuery.leftJoinAndSelect(`${KeyResultView.name}.user`, 'user')
    const teamConstrainedQuery = joinedUserQuery.andWhere('user.teams IN (:...teams)', {
      teams: allowedTeams,
    })

    return teamConstrainedQuery.getMany()
  }

  async findByBindingWithOwnsConstraint(
    binding: KeyResultViewBinding,
    userID: UserDTO['id'],
  ): Promise<KeyResultView | null> {
    const query = this.createQueryBuilder()
    const filteredQuery = query.where({ binding })
    const ownerConstrainedQuery = filteredQuery.andWhere(`${KeyResultView.name}.userId = :userID`, {
      userID,
    })

    return ownerConstrainedQuery.getOne()
  }

  async updateByIDWithCompanyConstraint(
    id: KeyResultViewDTO['id'],
    newData: QueryDeepPartialEntity<KeyResultView>,
    allowedCompanies: Array<CompanyDTO['id']>,
  ): Promise<KeyResultView | null> {
    const [owner] = await this.createQueryBuilder()
      .select(`${KeyResultView.name}.user_id`)
      .where({ id })
      .execute()

    const teams = await this.manager
      .createQueryBuilder()
      .from(User, 'user')
      .select('team')
      .innerJoin('user.teams', 'team')
      .where('user.id = :userID', { userID: owner.user_id })
      .execute()

    const anyCompanyIsAllowed = teams.some(({ team_company_id }) =>
      allowedCompanies.includes(team_company_id),
    )
    if (!anyCompanyIsAllowed) return

    await this.update(id, newData)

    return this.findOne(id)
  }

  async updateByIDWithTeamConstraint(
    id: KeyResultViewDTO['id'],
    newData: QueryDeepPartialEntity<KeyResultView>,
    allowedTeams: Array<TeamDTO['id']>,
  ): Promise<KeyResultView | null> {
    const [owner] = await this.createQueryBuilder()
      .select(`${KeyResultView.name}.user_id`)
      .where({ id })
      .execute()

    const teams = await this.manager
      .createQueryBuilder()
      .from(User, 'user')
      .select('team')
      .innerJoin('user.teams', 'team')
      .where('user.id = :userID', { userID: owner.user_id })
      .execute()

    const anyTeamIsAllowed = teams.some(({ team_id }) => allowedTeams.includes(team_id))
    if (!anyTeamIsAllowed) return

    await this.update(id, newData)

    return this.findOne(id)
  }

  async updateByIDWithOwnsConstraint(
    id: KeyResultViewDTO['id'],
    newData: QueryDeepPartialEntity<KeyResultView>,
    userID: UserDTO['id'],
  ): Promise<KeyResultView | null> {
    const query = this.createQueryBuilder()
      .update()
      .set(newData)
      .where('user_id = :userID AND id = :id', { id, userID })
      .execute()

    const { affected } = await query

    return affected > 0 ? this.findOne(id) : undefined
  }
}

export default DomainKeyResultViewRepository
