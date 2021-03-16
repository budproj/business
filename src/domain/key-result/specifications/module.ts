import { Module } from '@nestjs/common'

import IsOutdated from './is-outdated'

@Module({
  providers: [IsOutdated],
  exports: [IsOutdated],
})
class DomainKeyResultSpecificationsModule {}

export default DomainKeyResultSpecificationsModule
