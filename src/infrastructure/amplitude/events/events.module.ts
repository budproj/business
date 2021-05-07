import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { EventsFactory } from './events.factory'

@Module({
  imports: [CoreModule],
  providers: [EventsFactory],
  exports: [EventsFactory],
})
export class AmplitudeEventsModule {}
