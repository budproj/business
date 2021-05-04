import { Injectable } from '@nestjs/common'

import { CreateCheckInPort } from './create-check-in.port'

@Injectable()
export class CorePortsProvider {
  constructor(public readonly createCheckIn: CreateCheckInPort) {}
}
