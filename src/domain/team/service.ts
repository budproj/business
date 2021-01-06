import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { startOfWeek } from 'date-fns'
import { flatten, remove, uniq, uniqBy, orderBy } from 'lodash'
import { IsNull } from 'typeorm'

import { ConfidenceReport } from 'domain/key-result/report/confidence/entities'
import DomainKeyResultService from 'domain/key-result/service'
import DomainEntityService from 'domain/service'
import { TeamEntityFilter, TeamEntityRelation } from 'domain/team/types'
import { UserDTO } from 'domain/user/dto'

import { TeamDTO } from './dto'
import { Team } from './entities'
import DomainTeamRepository from './repository'
import DomainTeamSpecification from './specification'

@Injectable()
class DomainTeamService extends DomainEntityService<Team, TeamDTO> {
  constructor(
    public readonly repository: DomainTeamRepository,
    public readonly specification: DomainTeamSpecification,
    @Inject(forwardRef(() => DomainKeyResultService))
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(repository, DomainTeamService.name)
  }

  buildOnlyCompaniesSelector() {
    return {
      parentTeamId: IsNull(),
    }
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
    const defaultConfidence = 100

    const teams = await this.getAllTeamsBelowNodes(teamId, ['id'])
    const teamIDs = teams.map((team) => team.id)

    const keyResults = await this.keyResultService.getFromTeam(teamIDs)
    if (!keyResults) return defaultConfidence

    const teamCurrentConfidence = this.keyResultService.getLowestConfidenceFromList(keyResults)

    return teamCurrentConfidence
  }

  async getChildTeams(
    teamID: TeamDTO['id'] | Array<TeamDTO['id']>,
    filter?: TeamEntityFilter[],
    relations?: TeamEntityRelation[],
  ) {
    const teamIDs = Array.isArray(teamID) ? teamID : [teamID]
    const whereSelector = teamIDs.map((teamID) => ({
      parentTeamId: teamID,
    }))

    const childTeams = await this.repository.find({
      relations,
      select: filter,
      where: whereSelector,
    })

    return childTeams
  }

  async getParentTeam(teamId: TeamDTO['id']) {
    const { parentTeamId } = await this.getOne({ id: teamId })

    return this.getOne({ id: parentTeamId })
  }

  async getUsersInTeam(teamID: TeamDTO['id']) {
    const teamsBelowCurrentNode = await this.getAllTeamsBelowNodes(teamID)

    const teamUsers = await Promise.all(teamsBelowCurrentNode.map(async (team) => team.users))
    const flattenedTeamUsers = flatten(teamUsers)
    const uniqTeamUsers = uniqBy(flattenedTeamUsers, 'id')

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
    const nodesAsArray = Array.isArray(nodes) ? nodes : [nodes]

    let teams: Array<Partial<Team>> = await Promise.all(
      nodesAsArray.map(async (id) => this.getOne({ id })),
    )
    let nextIterationTeams = nodesAsArray

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

  async getLatestReport(teamID: TeamDTO['id']) {
    const users = await this.getUsersInTeam(teamID)
    const userIDs = users.map((user) => user.id)

    const reports = await this.keyResultService.report.getFromUsers(userIDs)
    const orderedReports = orderBy(reports, ['createdAt'], ['desc'])

    const latestReport = orderedReports[0]

    return latestReport
  }

  async getDepartmentsForCompany(company: TeamDTO | TeamDTO[]) {
    const companies = Array.isArray(company) ? company : [company]
    const companyIDs = companies.map((company) => company.id)

    const departments = await this.getChildTeams(companyIDs)

    return departments
  }
}

export default DomainTeamService
