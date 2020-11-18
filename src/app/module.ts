import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'

import { AuthzModule } from './authz'
import { KeyResultsModule } from './key-results'

@Module({
  imports: [ConfigModule.forFeature(appConfig), KeyResultsModule, AuthzModule],
})
class AppModule {}

export default AppModule
