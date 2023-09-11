import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Task } from '@prisma/mission-control/generated'
import { TaskAssignerService } from 'src/mission-control/domain/tasks/services/assigner-task.service'
import { TaskPlannerService } from 'src/mission-control/domain/tasks/services/task-planner.service'
import TasksService from 'src/mission-control/domain/tasks/services/tasks.service'

interface GetUserTasksDTO {
  teamId: string
  userId: string
}

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasks: TasksService,
    private readonly planner: TaskPlannerService,
    private readonly assigner: TaskAssignerService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserTasks(@Query() queryParameters: GetUserTasksDTO): Promise<Task[]> {
    const { teamId, userId } = queryParameters
    // Criar uma view para retornar as tasks de um usuário contendo mais propriedades: exemplo -> "isDone"
    // Criar factory que recebe uma task e retorna o estado da task (será usada em team-score-processor e em task.controller)

    const tasks = this.tasks.getUserTasks(userId, teamId)

    return tasks
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('execute')
  async execute(): Promise<any> {
    void this.planner.execute()
    void this.assigner.execute()
  }
}
