import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { RavenInterceptor, RavenModule } from 'nest-raven'

import { SentryConfigModule } from '@config/sentry/sentry.module'

import { SentryProvider } from './sentry.provider'

const RavenProvider = { provide: APP_INTERCEPTOR, useValue: new RavenInterceptor() }

@Module({
  imports: [SentryConfigModule, RavenModule],
  providers: [SentryProvider, RavenProvider],
})
export class SentryModule {}
