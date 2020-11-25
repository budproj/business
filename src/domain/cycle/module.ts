import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from 'domain/user'

import CycleRepository from './repository'
import CycleService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([CycleRepository]), UserModule],
  providers: [CycleService],
  exports: [CycleService],
})
class CycleModule {}

export default CycleModule
