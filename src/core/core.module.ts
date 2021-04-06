import { Module } from '@nestjs/common'

import { CoreProvider } from './core.provider'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [UserModule],
  providers: [CoreProvider],
  exports: [CoreProvider],
})
export class CoreModule {}
