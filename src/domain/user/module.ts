import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserRepository from './repository'
import UserService from './service'
import UserViewModule from './view'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), UserViewModule],
  providers: [UserService],
  exports: [UserService],
})
class UserModule {}

export default UserModule
