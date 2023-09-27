import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import TasksService from 'src/mission-control/domain/tasks/services/tasks.service'

import { TaskViewModel } from '../view/task-view.model'
import { buildWeekId } from '../../../helpers/build-week-id';

interface GetUserTasksDTO {
  teamID: string
  userID: string
  date: string
}

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasks: TasksService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUserTasks(@Query() queryParameters: GetUserTasksDTO) {
    const { teamID, userID, date = new Date() } = queryParameters
    const tasks = await this.tasks.getUserTasks(
      userID,
      teamID,
      buildWeekId(new Date(date).getTime()),
    )
    return TaskViewModel.toHTTP(tasks)
  }
}
