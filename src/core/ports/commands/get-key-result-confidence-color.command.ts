import { ConfidenceTagAdapter } from '@adapters/confidence-tag/confidence-tag.adapters'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'

import { Command } from './base.command'

export class GetKeyResultConfidenceColorCommand extends Command<string> {
  private readonly confidenceTagAdapter = new ConfidenceTagAdapter()

  public async execute(keyResult: KeyResultInterface): Promise<string> {
    const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(keyResult)

    return this.confidenceTagAdapter.getColorFromConfidence(latestCheckIn?.confidence)
  }
}
