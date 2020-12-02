import { Module } from '@nestjs/common'

import DomainKeyResultViewModule from './key-result'
import DomainUserViewService from './service'

@Module({
  imports: [DomainKeyResultViewModule],
  providers: [DomainUserViewService],
  exports: [DomainUserViewService],
})
class DomainUserViewModule {}

export default DomainUserViewModule
