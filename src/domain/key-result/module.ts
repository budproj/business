import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'
import DomainTeamModule from 'src/domain/team'

import DomainKeyResultCheckInModule from './check-in'
import DomainKeyResultCustomListModule from './custom-list'
import DomainKeyResultRepository from './repository'
import DomainKeyResultService from './service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainKeyResultRepository]),
    DomainKeyResultCustomListModule,
    DomainKeyResultCheckInModule,
    forwardRef(() => DomainTeamModule),
  ],
  providers: [DomainKeyResultService],
  exports: [DomainKeyResultService],
})
class DomainKeyResultModule {}

export default DomainKeyResultModule
