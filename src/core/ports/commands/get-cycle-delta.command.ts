import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { BaseDeltaCommand } from '@core/ports/commands/base-delta.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export class GetCycleDeltaCommand extends BaseDeltaCommand {
  private readonly getCycleStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getCycleStatus = this.factory.buildCommand<Status>('get-cycle-status')
  }

  public async execute(CycleID: string): Promise<Delta> {
    const comparisonDate = this.getComparisonDate()

    const currentStatus = await this.getCycleStatus.execute(CycleID)
    const previousStatus = await this.getCycleStatus.execute(CycleID, {
      date: comparisonDate,
    })

    return this.marshal(currentStatus, previousStatus)
  }
}
