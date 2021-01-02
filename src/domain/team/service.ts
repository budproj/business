import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { flatten, isEqual, remove, uniqBy } from 'lodash'

import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import { ProgressReport } from 'domain/key-result/report/progress/entities'
import DomainKeyResultService from 'domain/key-result/service'
import DomainEntityService from 'domain/service'
import { UserDTO } from 'domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'

@Injectable()
class DomainTeamService extends DomainEntityService<Team, TeamDTO> {
  constructor(
    public readonly repository: DomainTeamRepository,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(repository, DomainTeamService.name)
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Team[]> {
    return this.repository.find({ ownerId })
  }

  async getCurrentProgress(teamId: TeamDTO['id']): Promise<ProgressReport['valueNew']> {
    const childTeams = await this.getChildTeams(teamId, ['id'])
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const rootKeyResults = (await this.keyResultService.getFromTeam(teamId)) ?? []
    const childKeyResults = (await this.keyResultService.getFromTeam(childTeamIds)) ?? []
    const keyResults = remove([...rootKeyResults, ...childKeyResults])
    if (!keyResults) return

    const teamCurrentProgress = this.keyResultService.calculateCurrentAverageProgressFromList(
      keyResults,
    )

    return teamCurrentProgress
  }

  async getCurrentConfidence(teamId: TeamDTO['id']): Promise<ConfidenceReport['valueNew']> {
    const childTeams = await this.getChildTeams(teamId, ['id'])
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const keyResults = await this.keyResultService.getFromTeam(childTeamIds)
    if (!keyResults) return

    const teamCurrentConfidence = this.keyResultService.calculateCurrentAverageConfidenceFromList(
      keyResults,
    )

    return teamCurrentConfidence
  }

  async getChildTeams(
    teamId: TeamDTO['id'],
    filter?: Array<keyof Team>,
    relations?: Array<keyof Team>,
  ): Promise<Array<Partial<Team>>> {
    const childTeams = await this.repository.find({
      relations,
      select: filter,
      where: { parentTeamId: teamId },
    })

    return childTeams
  }

  async getUsersInTeam(teamId: TeamDTO['id']): Promise<UserDTO[]> {
    const rootTeamData = await this.repository
      .find({
        where: { id: teamId },
        relations: ['users'],
      })
      .then((teams) => teams[0])
    const rootTeamUsers = await rootTeamData.users

    const childTeams = await this.getChildTeams(teamId, undefined, ['users'])
    const childTeamsUsers = await Promise.all(childTeams.map(async (childTeam) => childTeam.users))

    const teamUsers = [...rootTeamUsers, ...flatten(childTeamsUsers)]
    const uniqTeamUsers = uniqBy(teamUsers, isEqual)

    return uniqTeamUsers
  }

  async getTeamsForUser(user: UserDTO) {
    const teams = await user.teams

    return teams
  }

  async getUserCompanies(user: UserDTO) {
    const teams = await this.getTeamsForUser(user)
    const companyPromises = teams.map(async (team) => this.getRootTeamForTeam(team))

    const companies = Promise.all(companyPromises)

    return companies
  }

  async getRootTeamForTeam(team: TeamDTO) {
    let rootTeam = team

    while (rootTeam.parentTeamId) {
      // Since we're dealing with a linked list, where we need to evaluate each step before trying the next one,
      // we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      rootTeam = await this.getOne({ id: rootTeam.parentTeamId })
    }

    return rootTeam
  }

  async getCompanyTeams(companyID: TeamDTO['id'] | Array<TeamDTO['id']>) {
    let teams: Array<Partial<TeamDTO>> = []
    let nextIterationTeams = Array.isArray(companyID) ? companyID : [companyID]

    while (nextIterationTeams.length > 0) {
      // Since we're dealing with a linked list, where we need to evaluate each step before trying the next one,
      // we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      const selectedTeams = await Promise.all(
        nextIterationTeams.map(async (teamID) => this.getChildTeams(teamID)),
      )
      const currentIterationTeams = flatten(selectedTeams)

      teams = [...teams, ...currentIterationTeams]
      nextIterationTeams = remove(currentIterationTeams.map((team) => team?.id))
    }

    return teams
  }
}

export default DomainTeamService
