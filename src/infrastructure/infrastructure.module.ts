import { Module } from '@nestjs/common'

import { AuthzModule } from './authz/authz.module'
import { ORMModule } from './orm/orm.module'

@Module({
  imports: [AuthzModule, ORMModule],
})
export class InfrastructureModule {}
