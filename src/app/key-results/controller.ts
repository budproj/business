import { Controller, Get, Logger, Query, UseGuards, UseInterceptors } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { Permissions, PermissionsGuard, User, AuthzInterceptor } from 'app/authz'
import { InjectKeyResultView } from 'app/key-results/interceptors'
import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import { KeyResultWithLatestReports } from 'domain/objective-aggregate/service'
import { User as UserEntity } from 'domain/user-aggregate/user/entities'

import { View } from './decorators'
import { GetKeyResultsDTO } from './dto'
import KeyResultsService from './service'

@Controller('key-results')
@UseInterceptors(AuthzInterceptor)
class KeyResultsController {
  private readonly logger = new Logger(KeyResultsController.name)

  constructor(private readonly keyResultsService: KeyResultsService) {}

  @UseGuards(AuthGuard('jwt'), PermissionsGuard)
  @Permissions('read:key-results')
  @UseInterceptors(InjectKeyResultView)
  @Get()
  async getKeyResults(
    @User() user: UserEntity,
    @Query() { scope }: GetKeyResultsDTO,
    @View() view: KeyResultView,
  ): Promise<Array<Partial<KeyResultWithLatestReports>>> {
    this.logger.log(
      `Getting all Key Results for user ${user.id.toString()}, scopped at ${scope} based in view ${view.id.toString()}`,
    )

    const handlers = {
      user: async () => this.keyResultsService.getUserKeyResultsFromView(user, view),
    }
    const scopedHandler = handlers[scope]
    const keyResults = await scopedHandler()
    this.logger.log({
      keyResults,
      message: `Selected user ${user.id} keyResults`,
    })

    return keyResults
  }
}

export default KeyResultsController
