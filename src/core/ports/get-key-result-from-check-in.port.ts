import { Injectable } from '@nestjs/common'

import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultProvider } from '@core/modules/key-result/key-result.provider'

import { Port } from './base.interface'

@Injectable()
export class GetKeyResultFromCheckInPort implements Port<Promise<KeyResult>> {
  constructor(private readonly keyResult: KeyResultProvider) {}

  public async execute(checkIn: Partial<KeyResultCheckIn>): Promise<KeyResult> {
    const indexes = { id: checkIn.keyResultId }
    const keyResult = await this.keyResult.getFromIndexes(indexes)

    return keyResult
  }
}
