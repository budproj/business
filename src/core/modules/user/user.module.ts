import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UserSettingProvider } from '@core/modules/user/setting/user-setting.provider'
import { UserSettingRepository } from '@core/modules/user/setting/user-setting.repository'
import { AmplitudeModule } from '@infrastructure/amplitude/amplitude.module'
import { AuthzModule } from '@infrastructure/authz/authz.module'

import { UserProvider } from './user.provider'
import { UserRepository } from './user.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, UserSettingRepository]), AuthzModule, AmplitudeModule],
  providers: [UserProvider, UserSettingProvider],
  exports: [UserProvider],
})
export class UserModule {}
