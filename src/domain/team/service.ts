import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { startOfWeek } from 'date-fns'
import { flatten, isEqual, remove, uniq, uniqBy } from 'lodash'

import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import DomainKeyResultService from 'domain/key-result/service'
import DomainEntityService from 'domain/service'
import { TeamEntityFilter, TeamEntityRelation } from 'domain/team/types'
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

  async parseUserCompanyIDs(user: UserDTO) {
    const userCompanies = await this.getUserRootTeams(user)
    const userCompanyIDs = uniq(userCompanies.map((company) => company.id))

    return userCompanyIDs
  }

  async parseUserCompaniesTeamIDs(companyIDs: Array<TeamDTO['id']>) {
    const companiesTeams = await this.getAllTeamsBelowNodes(companyIDs)
    const companiesTeamIDs = uniq(companiesTeams.map((team) => team.id))

    return companiesTeamIDs
  }

  async getFromOwner(ownerId: UserDTO['id']): Promise<Team[]> {
    return this.repository.find({ ownerId })
  }

  async getCurrentProgress(teamID: TeamDTO['id']) {
    const date = new Date()
    const currentProgress = await this.getProgressAtDate(date, teamID)

    return currentProgress
  }

  async getLastWeekProgress(teamID: TeamDTO['id']) {
    const date = new Date()
    const startOfWeekDate = startOfWeek(date)
    const currentProgress = await this.getProgressAtDate(startOfWeekDate, teamID)

    return currentProgress
  }

  async getProgressAtDate(date: Date, teamID: TeamDTO['id']) {
    const childTeams = await this.getAllTeamsBelowNodes(teamID, ['id'])
    const childTeamIds = childTeams.map((childTeam) => childTeam.id)

    const keyResults = await this.keyResultService.getFromTeam(childTeamIds)
    if (!keyResults) return

    const previousSnapshotDate = this.keyResultService.report.progress.snapshotDate
    this.keyResultService.report.progress.snapshotDate = date

    const teamProgress = this.keyResultService.calculateSnapshotAverageProgressFromList(keyResults)

    this.keyResultService.report.progress.snapshotDate = previousSnapshotDate

    return teamProgress
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
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ): Promise<Array<Partial<Team>>> {
    const childTeams = await this.repository.find({
      relations,
      select: filter,
      where: { parentTeamId: teamId },
    })

    return childTeams
  }

  async getParentTeam(teamId: TeamDTO['id']) {
    const { parentTeamId } = await this.getOne({ id: teamId })

    return this.getOne({ id: parentTeamId })
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

  async getUserRootTeams(user: UserDTO) {
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

  async getAllTeamsBelowNodes(
    nodes: TeamDTO['id'] | Array<TeamDTO['id']>,
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) {
    let teams: Array<Partial<TeamDTO>> = []
    let nextIterationTeams = Array.isArray(nodes) ? nodes : [nodes]

    while (nextIterationTeams.length > 0) {
      // Since we're dealing with a linked list, where we need to evaluate each step before trying the next one,
      // we can disable the following eslint rule
      // eslint-disable-next-line no-await-in-loop
      const selectedTeams = await Promise.all(
        nextIterationTeams.map(async (teamID) => this.getChildTeams(teamID, filter, relations)),
      )
      const currentIterationTeams = flatten(selectedTeams)

      teams = [...teams, ...currentIterationTeams]
      nextIterationTeams = remove(currentIterationTeams.map((team) => team?.id))
    }

    return teams
  }

  async getPercentageProgressIncrease(teamID: TeamDTO['id']) {
    const currentProgress = await this.getCurrentProgress(teamID)
    const lastWeekProgress = await this.getLastWeekProgress(teamID)

    const deltaProgress = currentProgress - lastWeekProgress

    return deltaProgress
  }
}

export default DomainTeamService
