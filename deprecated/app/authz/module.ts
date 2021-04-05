import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import appConfig from 'src/config/app'
import DomainModule from 'src/domain'

import AuthzGodUser from './god-user'
import AuthzService from './service'
import AuthzStrategy from './strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forFeature(appConfig),
    DomainModule,
  ],
  providers: [AuthzService, AuthzGodUser, AuthzStrategy],
  exports: [AuthzService],
})
class AuthzModule {}

export default AuthzModule
