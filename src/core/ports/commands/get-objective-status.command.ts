import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'

export class GetObjectiveStatusCommand extends BaseStatusCommand {
  public async execute(
    objectiveID: string,
    options: GetStatusOptions = this.defaultOptions,
  ): Promise<Status> {
    return this.getStatus(objectiveID, options, true)
  }
}
