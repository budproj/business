import { flatten, remove } from 'lodash'
import { getManager, Repository, SelectQueryBuilder } from 'typeorm'

import { TeamDTO } from 'domain/team/dto'
import { Team } from 'domain/team/entities'
import { UserDTO } from 'domain/user/dto'

export type SelectionQueryConstrain<E> = (_query?: SelectQueryBuilder<E>) => SelectQueryBuilder<E>

abstract class DomainEntityRepository<E> extends Repository<E> {
  constraintQueryToCompany(_teamIDsInCompany: Array<TeamDTO['id']>): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToCompany method')
  }

  constraintQueryToTeam(_allowedTeams: Array<TeamDTO['id']>): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToTeam method')
  }

  constraintQueryToOwns(_user: UserDTO): SelectionQueryConstrain<E> {
    throw new Error('You must implement the constraintQueryToOwns method')
  }

  async selectTeamsForUser(user: UserDTO) {
    const teams = await user.teams

    return teams
  }

  async selectCompaniesForUser(user: UserDTO) {
    const teams = await this.selectTeamsForUser(user)
    const companyPromises = teams.map(async (team) => this.selectRootTeamForTeam(team))

    const companies = Promise.all(companyPromises)

    return companies
  }

  async selectRootTeamForTeam(team: TeamDTO) {
    let rootTeam = team

    while (rootTeam.parentTeamId) {
      // eslint-disable-next-line no-await-in-loop
      rootTeam = await getManager()
        .createQueryBuilder(Team, 'team')
        .where('team.id = :id', { id: rootTeam.parentTeamId })
        .getOne()
    }

    return rootTeam
  }

  async selectTeamsForCompanies(companyIDs: Array<TeamDTO['id']>) {
    const teamPromises = companyIDs.map(async (companyID) => this.selectTeamsForCompany(companyID))
    const companiesTeams = await Promise.all(teamPromises)

    const teams = flatten(companiesTeams)

    return teams
  }

  async selectTeamsForCompany(companyID: TeamDTO['id']) {
    let teams: TeamDTO[] = []
    let nextIterationTeams = [companyID]

    while (nextIterationTeams.length > 0) {
      // eslint-disable-next-line no-await-in-loop
      const selectedTeams = await Promise.all(nextIterationTeams.map(this.selectTeamsForTeam))
      const currentIterationTeams = flatten(selectedTeams)

      teams = [...teams, ...currentIterationTeams]
      nextIterationTeams = remove(currentIterationTeams.map((team) => team?.id))
    }

    return teams
  }

  async selectTeamsForTeam(teamID: TeamDTO['id']) {
    const teams = await getManager()
      .createQueryBuilder(Team, 'team')
      .where('team.parentTeamId = :parentID', { parentID: teamID })
      .getMany()

    return teams
  }
}

export default DomainEntityRepository
