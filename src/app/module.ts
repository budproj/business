import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'

import { HelloModule } from './hello'

@Module({
  imports: [ConfigModule.forFeature(appConfig), HelloModule],
})
class AppModule {}

export default AppModule
