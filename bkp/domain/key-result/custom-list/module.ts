import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'src/domain/key-result'
import DomainTeamModule from 'src/domain/team'
import DomainUserModule from 'src/domain/user'

import DomainKeyResultCustomListRepository from './repository'
import DomainKeyResultCustomListService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainKeyResultCustomListRepository]),
    forwardRef(() => DomainUserModule),
    forwardRef(() => DomainKeyResultModule),
    forwardRef(() => DomainTeamModule),
  ],
  providers: [DomainKeyResultCustomListService],
  exports: [DomainKeyResultCustomListService],
})
class DomainKeyResultCustomListModule {}

export default DomainKeyResultCustomListModule
