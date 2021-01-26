import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultCheckInRepository from './repository'
import DomainKeyResultCheckInService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainKeyResultCheckInRepository])],
  providers: [DomainKeyResultCheckInService],
  exports: [DomainKeyResultCheckInService],
})
class DomainKeyResultCheckInModule {}

export default DomainKeyResultCheckInModule
