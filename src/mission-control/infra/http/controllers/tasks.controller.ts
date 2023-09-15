import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import TasksService from 'src/mission-control/domain/tasks/services/tasks.service'

import { TaskViewModel } from '../view/task-view.model'

interface GetUserTasksDTO {
  teamId: string
  userId: string
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserTasks(@Query() queryParameters: GetUserTasksDTO) {
    const { teamId, userId } = queryParameters
    // Criar uma view para retornar as tasks de um usuário contendo mais propriedades: exemplo -> "isDone"
    // Criar factory que recebe uma task e retorna o estado da task (será usada em team-score-processor e em task.controller)

    const tasks = await this.tasks.getUserTasks(userId, teamId)

    return TaskViewModel.toHTTP(tasks)
  }
}
