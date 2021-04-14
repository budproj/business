import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserProvider } from './user.provider'
import { UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UserProvider],
  exports: [UserProvider],
})
export class UserModule {}
