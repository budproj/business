import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { createAuthzConfig } from '@config/authz/authz.factory'

import { AuthzStrategyProvider } from './strategy.provider'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forFeature(createAuthzConfig),
  ],
  providers: [AuthzStrategyProvider],
})
export class AuthzModule {}
