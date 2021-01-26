import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'

import DomainKeyResultRepository from './repository'
import DomainKeyResultService from './service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainKeyResultRepository]),
  ],
  providers: [DomainKeyResultService],
  exports: [DomainKeyResultService],
})
class DomainKeyResultModule {}

export default DomainKeyResultModule
