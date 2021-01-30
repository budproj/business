import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultCustomListRepository from './repository'
import DomainKeyResultCustomListService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainKeyResultCustomListRepository])],
  providers: [DomainKeyResultCustomListService],
  exports: [DomainKeyResultCustomListService],
})
class DomainKeyResultCustomListModule {}

export default DomainKeyResultCustomListModule
