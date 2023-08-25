import { Module } from '@nestjs/common'

import { AWSModule } from '@infrastructure/aws/aws.module'

import { MissionControlDatabaseModule } from './infra/database/database.module'

@Module({
  imports: [MissionControlDatabaseModule, AWSModule],
})
export class MissionControlModule {}
