import { CheckMarkStates } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'

import { Command } from './base.command'

const stateFilter = (status) => ({ state }) => state === status

export interface GetCheckListProgressCommandResult {
  numberOfChecked: number
  progress: number
  total: number
}

export class GetCheckListProgressCommand extends Command<GetCheckListProgressCommandResult> {
  public async execute(keyResultId: KeyResult["id"]): Promise<GetCheckListProgressCommandResult> {
    const checkList = await this.core.keyResult.keyResultCheckMarkProvider.getFromKeyResult(keyResultId)

    const numberOfChecked = checkList.filter(stateFilter(CheckMarkStates.CHECKED)).length
    const total = checkList.length
    const progress = Math.round(numberOfChecked / total * 100) || 0

    return { total, numberOfChecked, progress }
  }
}
