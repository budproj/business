import { Module } from '@nestjs/common'

import { AmplitudeConfigModule } from '@config/amplitude/amplitude.module'

import { AmplitudeProvider } from './amplitude.provider'
import { AmplitudeEventsModule } from './events/events.module'

@Module({
  imports: [AmplitudeEventsModule, AmplitudeConfigModule],
  providers: [AmplitudeProvider],
  exports: [AmplitudeProvider],
})
export class AmplitudeModule {}
