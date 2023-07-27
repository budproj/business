import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AggregateExecutorFactory } from './aggregate-executor.factory'
import { TeamScopeFactory } from './team-scope.factory'

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [TeamScopeFactory, AggregateExecutorFactory],
  exports: [TeamScopeFactory, AggregateExecutorFactory],
})
export class WorkspaceModule {}
