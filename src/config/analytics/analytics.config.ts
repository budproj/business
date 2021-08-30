// eslint-disable-next-line unicorn/import-style
import { join } from 'path'

import { registerAs } from '@nestjs/config'

import { AnalyticsConfig } from './analytics.interface'

export const analyticsConfig = registerAs(
  'analytics',
  (): AnalyticsConfig => ({
    grpcServer: {
      url: process.env.ANALYTICS_URL,
      package: process.env.ANALYTICS_PACKAGES.split(','),
      protoPath: process.env.ANALYTICS_PACKAGES.split(',').map((packageName) =>
        join(__dirname, `../../../lib/grpc/analytics/${packageName}.proto`),
      ),
    },
  }),
)
