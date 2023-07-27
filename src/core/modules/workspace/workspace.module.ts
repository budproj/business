import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TeamScopeFactory } from './team-scope.factory'

@Module({
  imports: [TypeOrmModule.forFeature()],
  providers: [TeamScopeFactory],
  exports: [TeamScopeFactory],
})
export class WorkspaceModule {}
