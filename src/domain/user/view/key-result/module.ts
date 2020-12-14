import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'domain/key-result'
import DomainUserModule from 'domain/user'

import DomainKeyResultViewRepository from './repository'
import DomainKeyResultViewService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainKeyResultViewRepository]),
    forwardRef(() => DomainUserModule),
    DomainKeyResultModule,
  ],
  providers: [DomainKeyResultViewService],
  exports: [DomainKeyResultViewService],
})
class DomainKeyResultViewModule {}

export default DomainKeyResultViewModule
