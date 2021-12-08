import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserSettingProvider } from '@core/modules/user/setting/user-setting.provider'
import { UserSettingRepository } from '@core/modules/user/setting/user-setting.repository'
import { AuthzModule } from '@infrastructure/authz/authz.module'

import { UserProvider } from './user.provider'
import { UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserSettingRepository]), AuthzModule],
  providers: [UserProvider, UserSettingProvider],
  exports: [UserProvider],
})
export class UserModule {}
