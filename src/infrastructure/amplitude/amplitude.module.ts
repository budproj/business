import { Module } from '@nestjs/common'

import { AmplitudeProvider } from './amplitude.provider'
import { AmplitudeEventsModule } from './events/events.module'

@Module({
  imports: [AmplitudeEventsModule],
  providers: [AmplitudeProvider],
  exports: [AmplitudeProvider],
})
export class AmplitudeModule {}
