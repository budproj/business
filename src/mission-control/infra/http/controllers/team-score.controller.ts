import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import TeamScoreProcessorService from 'src/mission-control/domain/tasks/services/team-score-processor.service'

interface GetTeamScoresDTO {
  teamID: string
}

@Controller('score')
export class TeamScoreController {
  constructor(private readonly score: TeamScoreProcessorService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getTeamScore(@Query() queryParameters: GetTeamScoresDTO) {
    const { teamID } = queryParameters

    const teamScore = await this.score.getTeamScore(teamID)

    return { teamScore }
  }
}
