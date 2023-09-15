import { Module } from '@nestjs/common'

import { MissionControlDatabaseModule } from './infra/database/database.module'
import { HttpModule } from './infra/http/http.module'
import { JobsScheduleModule } from './jobs/jobs-schedule.module'

@Module({
  imports: [JobsScheduleModule, MissionControlDatabaseModule, HttpModule],
})
export class MissionControlModule {}
