import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthzModule } from '@infrastructure/authz/authz.module'

import { UserProvider } from './user.provider'
import { UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), AuthzModule],
  providers: [UserProvider],
  exports: [UserProvider],
})
export class UserModule {}
