import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'src/domain/key-result'
import DomainTeamModule from 'src/domain/team'
import DomainUserModule from 'src/domain/user'

import DomainKeyResultViewRepository from './repository'
import DomainKeyResultViewService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainKeyResultViewRepository]),
    forwardRef(() => DomainUserModule),
    DomainKeyResultModule,
    DomainTeamModule,
  ],
  providers: [DomainKeyResultViewService],
  exports: [DomainKeyResultViewService],
})
class DomainKeyResultViewModule {}

export default DomainKeyResultViewModule
