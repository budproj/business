import { Injectable } from '@nestjs/common'

import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultProvider } from '@core/modules/key-result/key-result.provider'

import { Port } from './base.interface'

@Injectable()
export class GetKeyResultPort implements Port<Promise<KeyResult>> {
  constructor(private readonly keyResult: KeyResultProvider) {}

  public async execute(indexes: Partial<KeyResultInterface>): Promise<KeyResult> {
    const keyResult = await this.keyResult.getFromIndexes(indexes)

    return keyResult
  }
}
