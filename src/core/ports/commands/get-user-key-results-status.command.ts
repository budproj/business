import { GetStatusOptions, Status } from '@core/interfaces/status.interface'
import { BaseStatusCommand } from '@core/ports/commands/base-status.command'

export class GetUserKeyResultStatus extends BaseStatusCommand {
  public async execute(userId: string, options: GetStatusOptions = this.defaultOptions): Promise<Status> {
    return this.getStatus(userId, options, false)
  }
}
