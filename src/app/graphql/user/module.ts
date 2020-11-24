import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import UserResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [UserResolver],
})
class UsersModule {}

export default UsersModule
