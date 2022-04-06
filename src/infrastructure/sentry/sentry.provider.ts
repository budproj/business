import { Injectable } from '@nestjs/common'
import * as Sentry from '@sentry/node'
import '@sentry/tracing'

import { SentryConfigProvider } from '@config/sentry/sentry.provider'

@Injectable()
export class SentryProvider {
  constructor(protected readonly config: SentryConfigProvider) {
    Sentry.init({
      dsn: config.dsn,
      sampleRate: config.sampleRate,
    })
  }
}
