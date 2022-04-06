import { registerAs } from '@nestjs/config'

import { SentryConfigInterface } from './sentry.interface'

export const sentryConfig = registerAs(
  'sentry',
  (): SentryConfigInterface => ({
    dsn: process.env.SENTRY_DSN,
    sampleRate: Number(process.env.SENTRY_SAMPLE_RATE) || 1,
  }),
)
