import { Controller, Post, Logger, UseGuards, UseInterceptors, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, User, AuthzInterceptor } from 'app/authz'
import { User as UserEntity } from 'domain/user-aggregate/user/entities'

import { PostProgressReportDTO } from './dto'
import { RejectNotOwnedKeyResults } from './interceptors'
import ProgressReportsService from './service'

@Controller('progress-reports')
@UseInterceptors(AuthzInterceptor)
class ProgressReportsController {
  private readonly logger = new Logger(ProgressReportsController.name)

  constructor(private readonly progressReportService: ProgressReportsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('create:progress-reports')
  @UseInterceptors(RejectNotOwnedKeyResults)
  @Post()
  async postProgressReport(
    @User() user: UserEntity,
    @Body() body: PostProgressReportDTO,
  ): Promise<string> {
    this.logger.log({
      body,
      message: `Creating a new progress report for user ${user.id.toString()}`,
    })

    const createdData = await this.progressReportService.createProgressReport(user, body)

    this.logger.log({
      createdData,
      message: `Created new progress report for user ${user.id.toString()}`,
    })

    return 'ok'
  }
}

export default ProgressReportsController
