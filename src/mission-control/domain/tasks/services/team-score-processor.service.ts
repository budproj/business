import { Injectable } from '@nestjs/common'

import { buildWeekId } from 'src/mission-control/helpers/build-week-id'

import { TaskRepository } from '../repositories/task-repositoriy'

export type Score = {
  teamId: string
  weekId: string
  progress: number
  available: number
}

@Injectable()
class TeamScoreProcessorService {
  constructor(private readonly taskRepository: TaskRepository) {}

  public async getTeamScore(teamId: string, date = new Date()): Promise<Score> {
    const weekId = buildWeekId(date)

    const teamGoal = await this.taskRepository.processTeamGoal(teamId, weekId)

    const tasks = await this.taskRepository.findMany({ teamId, weekId })

    return tasks.reduce(
      (score, task) => {
        return {
          ...score,
          progress: score.progress + task.score * task.completedSubtasks.length,
          available: score.progress + task.score * task.availableSubtasks.length,
        }
      },
      {
        teamId,
        weekId,
        progress: 0,
        available: 0,
        teamGoal,
      },
    )
  }
}

export default TeamScoreProcessorService
