import { Module } from '@nestjs/common'

import { FlagsmithConfigModule } from '@config/flagsmith/flagsmith.module'

import { FlagsmithProvider } from './flagsmith.provider'

@Module({
  imports: [FlagsmithConfigModule],
  providers: [FlagsmithProvider],
})
export class FlagsmithModule {}
