import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AuthzConfigModule } from '@config/authz/authz.module'

import { AuthzClientProvider } from './providers/client.provider'
import { AuthzCredentialsProvider } from './providers/credentials.provider'
import { AuthJwtProvider } from './providers/jwt.provider'
import { AuthzStrategyProvider } from './providers/strategy.provider'

@Module({
  imports: [AuthzConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthzClientProvider, AuthzStrategyProvider, AuthJwtProvider, AuthzCredentialsProvider],
  exports: [AuthzCredentialsProvider, AuthJwtProvider],
})
export class AuthzModule {}
