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
    const row = await this.core.entityManager.query(
      `
      SELECT *
      FROM cycle_status cs
      WHERE cs.cycle_id = $1
      `,
      [CycleID],
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
