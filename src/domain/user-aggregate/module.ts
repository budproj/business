import { Module } from '@nestjs/common'

import UserAggregateService from './service'
import UserModule from './user'

@Module({
  imports: [UserModule],
  providers: [UserAggregateService],
  exports: [UserAggregateService],
})
class UserAggregateModule {}

export default UserAggregateModule
