import { CoreProvider } from '@core/core.provider'
import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

interface GetTeamStatusOptions extends GetStatusOptions {
  cycleFilters?: Partial<CycleInterface>
}

export class GetTeamStatusCommand extends BaseStatusCommand {
  private readonly getObjectiveStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getObjectiveStatus = this.factory.buildCommand<Status>('get-objective-status')
  }

  public async execute(
    teamID: string,
    options: GetTeamStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const objectivesStatus = await this.getTeamObjectivesStatus(teamID, options)
    const childTeamsStatus = await this.getChildTeamsStatus(teamID, options)

    const allStatus = [...objectivesStatus, ...childTeamsStatus]
    const latestStatusReport = this.getLatestFromList(allStatus)
    const isOutdated = this.isOutdated(latestStatusReport.latestCheckIn)

    return {
      isOutdated,
      latestCheckIn: latestStatusReport.latestCheckIn,
      reportDate: latestStatusReport.reportDate,
      progress: this.getAverageProgressFromList(allStatus),
      confidence: this.getMinConfidenceFromList(allStatus),
    }
  }

  private async getTeamObjectivesStatus(
    teamID: string,
    options: GetTeamStatusOptions,
  ): Promise<Status[]> {
    const objectives = (await this.core.objective.getFromTeamWithCycleFilters(
      teamID,
      options.cycleFilters,
    )) as any
    const objectiveStatusPromises = objectives.map(async (objective) =>
      this.getObjectiveStatus.execute(objective.id, options),
    )

    return Promise.all(objectiveStatusPromises)
  }

  private async getChildTeamsStatus(
    teamID: string,
    options: GetTeamStatusOptions,
  ): Promise<Status[]> {
    const teamNodesFromTeam = await this.core.team.getTeamNodesTreeAfterTeam({ id: teamID })
    const childTeams = teamNodesFromTeam.filter((team) => team.id !== teamID)
    const childTeamStatusPromises = childTeams.map(async (team) => this.execute(team.id, options))

    return Promise.all(childTeamStatusPromises)
  }
}
