import { Module } from '@nestjs/common'

import { MissionControlDatabaseModule } from './infra/database/database.module'
import { HttpModule } from './infra/http/http.module'

@Module({
  imports: [MissionControlDatabaseModule, HttpModule],
})
export class MissionControlModule {}
