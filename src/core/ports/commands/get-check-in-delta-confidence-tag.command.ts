import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Command } from './base.command'

export class GetCheckInDeltaConfidenceTagCommand extends Command<number> {
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  public async execute(checkIn: KeyResultCheckIn): Promise<number> {
    const parentCheckIn = await this.core.keyResult.getParentCheckInFromCheckIn(checkIn)
    const deltaConfidenceTag = this.confidenceTagAdapter.differenceInConfidenceTagIndexes(
      parentCheckIn?.confidence,
      checkIn.confidence,
    )

    return deltaConfidenceTag
  }
}
