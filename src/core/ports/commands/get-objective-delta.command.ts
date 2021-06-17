import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { BaseDeltaCommand } from '@core/ports/commands/base-delta.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export class GetObjectiveDeltaCommand extends BaseDeltaCommand {
  private readonly getObjectiveStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getObjectiveStatus = this.factory.buildCommand<Status>('get-objective-status')
  }

  public async execute(objectiveID: string): Promise<Delta> {
    const comparisonDate = this.getComparisonDate()

    const currentStatus = await this.getObjectiveStatus.execute(objectiveID)
    const previousStatus = await this.getObjectiveStatus.execute(objectiveID, {
      date: comparisonDate,
    })

    return {
      progress: this.getProgressDifference(currentStatus, previousStatus),
    }
  }
}
