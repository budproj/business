import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'

import { GraphQLAuthGuard } from 'src/app/authz/guards'
import appConfig from 'src/config/app'

import AuthzStrategy from './strategy'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule.forFeature(appConfig),
  ],
  providers: [AuthzStrategy, GraphQLAuthGuard],
  exports: [PassportModule, GraphQLAuthGuard],
})
class AuthzModule {}

export default AuthzModule
