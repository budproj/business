import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'
import DomainKeyResultCommentModule from 'src/domain/key-result/comment/module'
import DomainTeamModule from 'src/domain/team'

import DomainKeyResultCheckInModule from './check-in'
import DomainKeyResultRepository from './repository'
import DomainKeyResultService from './service'
import DomainKeyResultSpecification from './specification'
import DomainKeyResultSpecificationsModule from './specifications/module'
import DomainKeyResultTimelineService from './timeline'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainKeyResultRepository]),
    forwardRef(() => DomainTeamModule),
    forwardRef(() => DomainKeyResultCheckInModule),
    forwardRef(() => DomainKeyResultCommentModule),
    DomainKeyResultSpecificationsModule,
  ],
  providers: [DomainKeyResultService, DomainKeyResultTimelineService, DomainKeyResultSpecification],
  exports: [DomainKeyResultService],
})
class DomainKeyResultModule {}

export default DomainKeyResultModule
