import { Module } from '@nestjs/common'

import KeyResultViewModule from './key-result'
import UserViewService from './service'

@Module({
  imports: [KeyResultViewModule],
  providers: [UserViewService],
  exports: [UserViewService],
})
class UserViewModule {}

export default UserViewModule
