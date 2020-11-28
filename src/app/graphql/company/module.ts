import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import CompanyResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [CompanyResolver],
})
class CompanysModule {}

export default CompanysModule
