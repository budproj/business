import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import TeamScoreProcessorService from 'src/mission-control/domain/tasks/services/team-score-processor.service'

interface GetTeamScoresDTO {
  teamId: string
}

@Controller('score')
export class TeamScoreController {
  constructor(private readonly score: TeamScoreProcessorService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserTasks(@Query() queryParameters: GetTeamScoresDTO) {
    const { teamId } = queryParameters

    const teamScore = await this.score.getTeamScore(teamId)

    return { teamScore }
  }
}
