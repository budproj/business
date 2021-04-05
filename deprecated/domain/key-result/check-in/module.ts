import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'src/domain/key-result/module'

import DomainKeyResultCheckInRepository from './repository'
import DomainKeyResultCheckInService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainKeyResultCheckInRepository]),
    forwardRef(() => DomainKeyResultModule),
  ],
  providers: [DomainKeyResultCheckInService],
  exports: [DomainKeyResultCheckInService],
})
class DomainKeyResultCheckInModule {}

export default DomainKeyResultCheckInModule
