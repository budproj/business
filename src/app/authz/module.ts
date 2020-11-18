import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import appConfig from 'config/app'

import AuthzService from './service'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forFeature(appConfig),
  ],
  providers: [AuthzService],
  exports: [PassportModule],
})
class AuthzModule {}

export default AuthzModule
