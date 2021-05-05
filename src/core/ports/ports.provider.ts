import { Injectable } from '@nestjs/common'

import { CreateCheckInPort } from './create-check-in.port'
import { GetKeyResultPort } from './get-key-result'
import { GetKeyResultOwnerPort } from './get-key-result-owner.port'

@Injectable()
export class CorePortsProvider {
  constructor(
    public readonly createCheckIn: CreateCheckInPort,
    public readonly getKeyResultOwner: GetKeyResultOwnerPort,
    public readonly getKeyResult: GetKeyResultPort,
  ) {}
}
