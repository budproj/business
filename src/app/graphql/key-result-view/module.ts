import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'app/providers'
import appConfig from 'config/app'
import DomainModule from 'domain/module'

import KeyResultViewResolver from './resolver'
import KeyResultViewService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [KeyResultViewResolver, KeyResultViewService, Railway],
})
class KeyResultViewsModule {}

export default KeyResultViewsModule
