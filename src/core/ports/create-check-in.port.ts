import { Injectable } from '@nestjs/common'

import { Context } from '@adapters/context/interfaces/context.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { Port } from './base.interface'

@Injectable()
export class CreateCheckInPort implements Port<Promise<KeyResultCheckIn>> {
  public async execute(
    checkIn: Partial<KeyResultCheckIn>,
    context: Context,
  ): Promise<KeyResultCheckIn> {
    console.log(checkIn, context)

    return {} as any
  }
}
