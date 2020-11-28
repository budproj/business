import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import UserResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [UserResolver],
})
class UsersModule {}

export default UsersModule
