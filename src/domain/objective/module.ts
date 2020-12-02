import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainUserModule from 'domain/user'

import DomainObjectiveRepository from './repository'
import DomainObjectiveService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainObjectiveRepository]), DomainUserModule],
  providers: [DomainObjectiveService],
  exports: [DomainObjectiveService],
})
class DomainObjectiveModule {}

export default DomainObjectiveModule
