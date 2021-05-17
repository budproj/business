import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

type DeltaType = 'value' | 'progress' | 'confidence' | 'confidenceTag'
type TypeHandler = (
  checkIn: KeyResultCheckIn,
  keyResult: KeyResult,
  parent?: KeyResultCheckIn,
) => number

export class GetKeyResultCheckInDeltaCommand extends Command<number> {
  private readonly typeHandlers: Record<DeltaType, TypeHandler> = {
    value: (...handlerArguments) => this.core.keyResult.getCheckInDeltaValue(...handlerArguments),
    progress: (...handlerArguments) =>
      this.core.keyResult.getCheckInDeltaProgress(...handlerArguments),
    confidence: (...handlerArguments) =>
      this.core.keyResult.getCheckInDeltaConfidence(...handlerArguments),
    confidenceTag: (...handlerArguments) =>
      this.core.keyResult.getCheckInDeltaConfidenceTag(...handlerArguments),
  }

  public async execute(checkIn: KeyResultCheckIn, type: DeltaType): Promise<number> {
    const parent = await this.core.keyResult.getParentCheckInFromCheckIn(checkIn)
    const keyResult = await this.core.keyResult.getFromIndexes({ id: checkIn.keyResultId })
    const handler = this.typeHandlers[type]

    return handler(checkIn, keyResult, parent)
  }
}
