import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { BaseDeltaCommand } from '@core/ports/commands/base-delta.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'
import { GetTeamStatusOptions } from '@core/ports/commands/get-team-status.command'

/**
 * @deprecated prefer using the `StatusProvider` instead
 */
export class GetTeamDeltaCommand extends BaseDeltaCommand {
  private readonly getTeamStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getTeamStatus = this.factory.buildCommand<Status>('get-team-status')
  }

  public async execute(teamID: string, options?: GetTeamStatusOptions): Promise<Delta> {
    const comparisonDate = this.getComparisonDate()

    const currentStatus = await this.getTeamStatus.execute(teamID, options)
    const previousStatus = await this.getTeamStatus.execute(teamID, {
      ...options,
      date: comparisonDate,
    })

    return this.marshal(currentStatus, previousStatus)
  }
}
