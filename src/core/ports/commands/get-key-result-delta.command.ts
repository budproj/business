import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { BaseDeltaCommand } from '@core/ports/commands/base-delta.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export class GetKeyResultDeltaCommand extends BaseDeltaCommand {
  private readonly getKeyResultStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getKeyResultStatus = this.factory.buildCommand<Status>('get-key-result-status')
  }

  public async execute(keyResultID: string): Promise<Delta> {
    const comparisonDate = this.getComparisonDate()

    const currentStatus = await this.getKeyResultStatus.execute(keyResultID)
    const previousStatus = await this.getKeyResultStatus.execute(keyResultID, {
      date: comparisonDate,
    })

    return this.marshal(currentStatus, previousStatus)
  }
}
