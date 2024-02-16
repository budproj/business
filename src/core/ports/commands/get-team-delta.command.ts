import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { BaseDeltaCommand } from '@core/ports/commands/base-delta.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'
import { GetTeamStatusOptions } from '@core/ports/commands/get-team-status.command'

export class GetTeamDeltaCommand extends BaseDeltaCommand {
  private readonly getTeamStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getTeamStatus = this.factory.buildCommand<Status>('get-team-status')
  }

  public async execute(teamID: string, options?: GetTeamStatusOptions): Promise<Delta> {
    const row = await this.core.entityManager.query(
      `
      SELECT *
      FROM team_status ts
      WHERE ts.team_id = $1
      `,
      [teamID],
    )
    if (row[0]) {
      return {
        progress: row[0].progress - row[0].previous_progress,
        confidence: row[0].confidence - row[0].previous_confidence,
      }
    }

    return {
      progress: 0,
      confidence: 0,
    }
  }
}