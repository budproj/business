import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AuthzConfigModule } from '@config/authz/authz.module'

import { AuthzClientProvider } from './providers/client.provider'
import { AuthzCredentialsProvider } from './providers/credentials.provider'
import { AuthzStrategyProvider } from './providers/strategy.provider'

@Module({
  imports: [AuthzConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthzClientProvider, AuthzStrategyProvider, AuthzCredentialsProvider],
  exports: [AuthzCredentialsProvider],
})
export class AuthzModule {}
