import { Injectable } from '@nestjs/common'

import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultProvider } from '@core/modules/key-result/key-result.provider'

import { Port } from './base.interface'

@Injectable()
export class CreateCheckInPort implements Port<Promise<KeyResultCheckIn>> {
  constructor(private readonly keyResult: KeyResultProvider) {}

  public async execute(checkIn: Partial<KeyResultCheckIn>): Promise<KeyResultCheckIn> {
    const createdCheckIn = await this.keyResult.createCheckIn(checkIn)

    return createdCheckIn
  }
}