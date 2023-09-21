import { Injectable } from '@nestjs/common'

import { Task } from '@prisma/mission-control/generated'
import { TaskRepository } from 'src/mission-control/domain/tasks/repositories/task-repositoriy'
import { TaskId } from 'src/mission-control/domain/tasks/types'

import { BASE_GOAL_VALUE } from '../../constants'
import { PrismaService } from '../prisma.service'

type TeamGoalModel = {
  max: number
}
@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(taskId: Partial<TaskId>): Promise<Task[]> {
    return this.prisma.task.findMany({ where: taskId })
  }

  async processTeamGoal(teamId: Task['teamId'], weekId: Task['weekId']): Promise<number> {
    const [{ max: currentTeamGoal }] = await this.prisma.$queryRaw<
      TeamGoalModel[]
    >`WITH recursive RecursiveTeamGoal AS (
      SELECT
        ${weekId}::timestamp AS current_week,
        ${BASE_GOAL_VALUE}::double precision AS teamGoal,
        (
          SELECT COALESCE(SUM(score), 0.0)
          FROM "Task"
          WHERE
            "teamId" = ${teamId}
            AND "weekId"::date = ${weekId}::date - interval '7 days'
        ) AS previous_week_total_score
      UNION ALL
      SELECT
        current_week - interval '7 days' AS current_week,
        CASE
          WHEN previous_week_total_score >= teamGoal THEN previous_week_total_score + ${BASE_GOAL_VALUE}::float8
          ELSE teamGoal
        END AS teamGoal,
        (
          SELECT COALESCE(SUM(score), 0.0)
          FROM "Task"
          WHERE
            "teamId" = ${teamId}
            AND "weekId"::date = current_week - interval '7 days'
        ) AS previous_week_total_score
      FROM RecursiveTeamGoal
      WHERE current_week > ${weekId}::date - interval '7 days'
    )
    SELECT MAX(teamGoal) FROM RecursiveTeamGoal;`

    return currentTeamGoal
  }

  async addSubtask(taskId: TaskId, stepId: string): Promise<void> {
    const task = await this.prisma.task.findUnique({
      where: { userId_teamId_weekId_templateId: { ...taskId } },
    })
    const availableSubtasks = task.completedSubtasks.includes(stepId)
      ? task.completedSubtasks
      : [...task.completedSubtasks, stepId]

    await this.prisma.task.update({
      where: {
        userId_teamId_weekId_templateId: { ...taskId },
      },
      data: { completedSubtasks: { push: stepId }, availableSubtasks },
    })
  }

  async createMany(tasks: Task[]): Promise<void> {
    await this.prisma.task.createMany({ data: tasks })
  }
}
