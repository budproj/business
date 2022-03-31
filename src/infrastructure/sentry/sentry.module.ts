import { Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { RavenInterceptor, RavenModule } from 'nest-raven'

@Module({
  imports: [RavenModule],
  providers: [{ provide: APP_INTERCEPTOR, useValue: new RavenInterceptor() }],
})
export class SentryModule {}
