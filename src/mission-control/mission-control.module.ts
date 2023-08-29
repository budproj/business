import { Module } from '@nestjs/common'

import { UserModule } from '@core/modules/user/user.module'
import { AWSModule } from '@infrastructure/aws/aws.module'

import { MissionControlDatabaseModule } from './infra/database/database.module'

@Module({
  imports: [MissionControlDatabaseModule, AWSModule, UserModule],
})
export class MissionControlModule {}
