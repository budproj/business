import { Module } from '@nestjs/common'

import { AWSModule } from '@infrastructure/aws/aws.module'
import { MissionControlDatabaseModule } from 'src/llm/infra/database/database.module'
import { HttpModule } from 'src/llm/infra/http/http.module'

@Module({
  imports: [HttpModule, MissionControlDatabaseModule, AWSModule],
})
export class MissionControlModule {}
