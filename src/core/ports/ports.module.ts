import { Module } from '@nestjs/common'

import { KeyResultModule } from '@core/modules/key-result/key-result.module'
import { UserModule } from '@core/modules/user/user.module'

import { CreateCheckInPort } from './create-check-in.port'
import { GetKeyResultPort } from './get-key-result'
import { GetKeyResultOwnerPort } from './get-key-result-owner.port'
import { CorePortsProvider } from './ports.provider'

@Module({
  imports: [UserModule, KeyResultModule],
  providers: [CorePortsProvider, CreateCheckInPort, GetKeyResultOwnerPort, GetKeyResultPort],
  exports: [CorePortsProvider],
})
export class CorePortsModule {}
