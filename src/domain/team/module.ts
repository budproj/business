import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from 'domain/user'

import TeamRepository from './repository'
import TeamService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([TeamRepository]), UserModule],
  providers: [TeamService],
  exports: [TeamService],
})
class TeamModule {}

export default TeamModule
