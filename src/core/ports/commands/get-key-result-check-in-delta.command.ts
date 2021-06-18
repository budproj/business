import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { BaseDeltaCommand } from '@core/ports/commands/base-delta.command'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'

export interface KeyResultCheckInDelta extends Delta {
  value: number
  confidenceTag: number
}

export class GetKeyResultCheckInDeltaCommand extends BaseDeltaCommand<KeyResultCheckInDelta> {
  private readonly getKeyResultCheckInStatus: Command<Status>
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getKeyResultCheckInStatus = this.factory.buildCommand<Status>(
      'get-key-result-check-in-status',
    )
  }

  public async execute(keyResultCheckInID: string): Promise<KeyResultCheckInDelta> {
    const currentStatus = await this.getKeyResultCheckInStatus.execute(keyResultCheckInID)
    const previousStatus = await this.getKeyResultCheckInStatus.execute(
      currentStatus.latestCheckIn?.parentId,
    )

    return this.marshal(currentStatus, previousStatus)
  }

  protected marshal(currentStatus: Status, previousStatus: Status): KeyResultCheckInDelta {
    const originalDeltaValues = super.marshal(currentStatus, previousStatus)
    const previousValue = previousStatus.latestCheckIn?.value ?? 0

    return {
      ...originalDeltaValues,
      value: currentStatus.latestCheckIn.value - previousValue,
      confidenceTag: this.confidenceTagAdapter.differenceInConfidenceTagIndexes(
        currentStatus.confidence,
        previousStatus.confidence,
      ),
    }
  }
}
