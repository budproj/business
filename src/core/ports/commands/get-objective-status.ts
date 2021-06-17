import { CoreProvider } from '@core/core.provider'
import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export class GetObjectiveStatusCommand extends BaseStatusCommand {
  private readonly getKeyResultStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getKeyResultStatus = this.factory.buildCommand<Status>('get-key-result-status')
  }

  public async execute(
    objectiveID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const keyResults = await this.core.keyResult.getFromObjective({ id: objectiveID })
    const keyResultStatusPromises = keyResults.map(async (keyResult) =>
      this.getKeyResultStatus.execute(keyResult.id, options),
    )

    const keyResultsStatus = await Promise.all(keyResultStatusPromises)
    const latestStatusReport = this.getLatestFromList(keyResultsStatus)

    return {
      latestCheckIn: latestStatusReport.latestCheckIn,
      reportDate: latestStatusReport.reportDate,
      progress: this.getAverageProgressFromList(keyResultsStatus),
      confidence: this.getMinConfidenceFromList(keyResultsStatus),
    }
  }
}
