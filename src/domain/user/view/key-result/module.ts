import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainUserModule from 'domain/user'

import DomainKeyResultViewRepository from './repository'
import DomainKeyResultViewService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainKeyResultViewRepository]),
    forwardRef(() => DomainUserModule),
  ],
  providers: [DomainKeyResultViewService],
  exports: [DomainKeyResultViewService],
})
class DomainKeyResultViewModule {}

export default DomainKeyResultViewModule
