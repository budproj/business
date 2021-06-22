import { groupBy, flatten } from 'lodash'

import { CoreProvider } from '@core/core.provider'
import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export interface GetTeamStatusOptions extends GetStatusOptions {
  cycleFilters?: Partial<CycleInterface>
}

type KeyResultPair = [string, KeyResult[]]
type StatusPair = [string, Status[]]
type StatusGroup = Status[]

export class GetTeamStatusCommand extends BaseStatusCommand {
  private readonly getKeyResultStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getKeyResultStatus = this.factory.buildCommand<Status>('get-key-result-status')
  }

  public async execute(
    teamID: string,
    options: GetTeamStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const keyResultsStatus = await this.getTeamKeyResultsStatusGroupedByObjective(teamID, options)
    const allTeamStatusReports = flatten(keyResultsStatus)

    const latestStatusReport = this.getLatestFromList(allTeamStatusReports)
    const isOutdated = this.isOutdated(latestStatusReport.latestCheckIn)
    const isActive = allTeamStatusReports.some((status) => status.isActive)

    return {
      isOutdated,
      isActive,
      latestCheckIn: latestStatusReport.latestCheckIn,
      reportDate: latestStatusReport.reportDate,
      progress: this.getAverageFromObjectiveGroups(keyResultsStatus),
      confidence: this.getMinConfidenceFromList(allTeamStatusReports),
    }
  }

  private async getTeamKeyResultsStatusGroupedByObjective(
    teamID: string,
    options: GetTeamStatusOptions,
  ): Promise<StatusGroup[]> {
    const keyResultObjectivePairs = await this.getKeyResultObjectivePairs(teamID, options)
    const keyResultStatusObjectivePairs = await this.getKeyResultStatusFromPairs(
      keyResultObjectivePairs,
      options,
    )

    return keyResultStatusObjectivePairs.map(([_, status]) => status)
  }

  private async getKeyResultObjectivePairs(
    teamID: string,
    options: GetTeamStatusOptions,
  ): Promise<KeyResultPair[]> {
    const keyResults = await this.core.keyResult.getFromTeamWithCycleFilters(
      teamID,
      options.cycleFilters,
    )
    const keyResultsGroupedByObjective = groupBy(keyResults, 'objectiveId')

    return Object.entries(keyResultsGroupedByObjective)
  }

  private async getKeyResultStatusFromPairs(
    pairs: KeyResultPair[],
    options: GetTeamStatusOptions,
  ): Promise<StatusPair[]> {
    const pairsStatusPromises = pairs.map(async ([objectiveID, keyResults]) => [
      objectiveID,
      await this.getKeyResultListStatus(keyResults, options),
    ]) as any

    return Promise.all(pairsStatusPromises)
  }

  private async getKeyResultListStatus(
    keyResults: KeyResult[],
    options: GetTeamStatusOptions,
  ): Promise<Status[]> {
    const statusPromises = keyResults.map(async (keyResult) =>
      this.getKeyResultStatus.execute(keyResult.id, options),
    )

    return Promise.all(statusPromises)
  }

  private getAverageFromObjectiveGroups(statusGroups: StatusGroup[]): number {
    const groupedAverages = statusGroups.map((group) => this.getAverageProgressFromList(group))

    return this.getAverage(groupedAverages)
  }
}
