import { Module } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

import { MissionControlDatabaseModule } from './infra/database/database.module'
import { HttpModule } from './infra/http/http.module'
import { JobsScheduleModule } from './jobs/jobs-schedule.module'

@Module({
  imports: [
    JobsScheduleModule,
    MissionControlDatabaseModule,
    HttpModule,
    RouterModule.register([
      {
        path: 'mission-control',
        module: HttpModule,
      },
    ]),
  ],
})
export class MissionControlModule {}
