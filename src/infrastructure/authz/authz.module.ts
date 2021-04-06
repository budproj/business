import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'

import { AuthzConfigModule } from '@config/authz/authz.module'

import { AuthzStrategyProvider } from './strategy.provider'

@Module({
  imports: [AuthzConfigModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AuthzStrategyProvider],
})
export class AuthzModule {}
