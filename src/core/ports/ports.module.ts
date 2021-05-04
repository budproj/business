import { Module } from '@nestjs/common'

import { CreateCheckInPort } from './create-check-in.port'
import { CorePortsProvider } from './ports.provider'

@Module({
  providers: [CorePortsProvider, CreateCheckInPort],
  exports: [CorePortsProvider],
})
export class CorePortsModule {}
