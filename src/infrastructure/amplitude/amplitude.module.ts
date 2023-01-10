import { Module } from '@nestjs/common'

import { AmplitudeConfigModule } from '@config/amplitude/amplitude.module'
import { AmplitudeConfigProvider } from '@config/amplitude/amplitude.provider'

import { UserProfileProvider } from './providers/user-profile.provider'

@Module({
  imports: [AmplitudeConfigModule],
  providers: [AmplitudeConfigProvider, UserProfileProvider],
  exports: [UserProfileProvider],
})
export class AmplitudeModule {}
