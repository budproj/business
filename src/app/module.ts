import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'

import { KeyResultsModule } from './key-results'

@Module({
  imports: [ConfigModule.forFeature(appConfig), KeyResultsModule],
})
class AppModule {}

export default AppModule
