import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'

import DomainObjectiveRepository from './repository'
import DomainObjectiveService from './service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainObjectiveRepository]),
  ],
  providers: [DomainObjectiveService],
  exports: [DomainObjectiveService],
})
class DomainObjectiveModule {}

export default DomainObjectiveModule
