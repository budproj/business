import { CoreProvider } from '@core/core.provider'
import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export class GetCycleStatusCommand extends BaseStatusCommand {
  private readonly getObjectiveStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getObjectiveStatus = this.factory.buildCommand<Status>('get-objective-status')
  }

  public async execute(
    cycleID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    const objectives = await this.core.objective.getFromCycle({ id: cycleID })
    const objectiveStatusPromises = objectives.map(async (objective) =>
      this.getObjectiveStatus.execute(objective.id, options),
    )

    const objectivesStatus = await Promise.all(objectiveStatusPromises)
    const latestStatusReport = this.getLatestFromList(objectivesStatus)
    const isOutdated = this.isOutdated(latestStatusReport.latestCheckIn)

    return {
      isOutdated,
      latestCheckIn: latestStatusReport.latestCheckIn,
      reportDate: latestStatusReport.reportDate,
      progress: this.getAverageProgressFromList(objectivesStatus),
      confidence: this.getMinConfidenceFromList(objectivesStatus),
    }
  }
}
