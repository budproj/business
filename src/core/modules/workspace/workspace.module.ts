import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AggregateExecutorFactory } from './aggregate-executor.factory'
import { SourceSegmentFactory } from './source-segment.factory'
import { TeamScopeFactory } from './team-scope.factory'

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [SourceSegmentFactory, TeamScopeFactory, AggregateExecutorFactory],
  exports: [SourceSegmentFactory, TeamScopeFactory, AggregateExecutorFactory],
})
export class WorkspaceModule {}
