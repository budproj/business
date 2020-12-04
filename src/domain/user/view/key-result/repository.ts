import { EntityRepository, Repository } from 'typeorm'

import { CompanyDTO } from 'domain/company/dto'
import { TeamDTO } from 'domain/team/dto'
import { UserDTO } from 'domain/user/dto'
import { KeyResultViewDTO } from 'domain/user/view/key-result/dto'
import { KeyResultViewBinding } from 'domain/user/view/key-result/types'

import { KeyResultView } from './entities'

export type UpdateWithConditionsOptions = Partial<Record<keyof KeyResultView, unknown>>

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

  async updateWithConditions(
    newData: Partial<KeyResultView>,
    conditions: UpdateWithConditionsOptions,
  ): Promise<KeyResultView> {
    const query = this.createQueryBuilder()
    const updateQuery = query.update(KeyResultView)
    const setQuery = updateQuery.set(newData)
    const filteredQuery = setQuery.where(conditions)

    await filteredQuery.execute()
    const updatedData = await this.findOne({ where: conditions })

    return updatedData
  }
}

export default DomainKeyResultViewRepository
