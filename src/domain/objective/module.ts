import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'
import DomainKeyResultModule from 'src/domain/key-result'

import DomainObjectiveRepository from './repository'
import DomainObjectiveService from './service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainObjectiveRepository]),
    DomainKeyResultModule,
  ],
  providers: [DomainObjectiveService],
  exports: [DomainObjectiveService],
})
class DomainObjectiveModule {}

export default DomainObjectiveModule
