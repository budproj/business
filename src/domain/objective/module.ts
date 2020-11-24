import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from 'domain/user'

import ObjectiveRepository from './repository'
import ObjectiveService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([ObjectiveRepository]), UserModule],
  providers: [ObjectiveService],
  exports: [ObjectiveService],
})
class ObjectiveModule {}

export default ObjectiveModule
