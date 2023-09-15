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
    const tasks = await this.tasks.getUserTasks(userId, teamId)
    return TaskViewModel.toHTTP(tasks)
  }
}
