import { Module } from '@nestjs/common'

import IsACompany from './is-a-company'

@Module({
  providers: [IsACompany],
  exports: [IsACompany],
})
class DomainTeamSpecificationsModule {}

export default DomainTeamSpecificationsModule
