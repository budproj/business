import { Module } from '@nestjs/common'

import { DatabaseModule } from 'src/llm/infra/database/database.module'
import { HttpModule } from 'src/llm/infra/http/http.module'

@Module({
  imports: [HttpModule, DatabaseModule],
})
export class LLMsDomainModule {}
