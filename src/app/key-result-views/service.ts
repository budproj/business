import { Injectable, Logger } from '@nestjs/common'

import { KeyResultViewDTO } from 'domain/objective-aggregate/key-result-view/dto'
import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

@Injectable()
class KeyResultViewsService {
  private readonly logger = new Logger(KeyResultViewsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async getViewsForUser(user: User): Promise<KeyResultViewDTO[]> {
    const views = await this.objectiveAggregateService.getUserViews(user.id)

    return views
  }

  async createKeyResultView(
    user: User,
    keyResultView: Partial<KeyResultViewDTO>,
  ): Promise<KeyResultView> {
    const keyResultBindedWithUser = {
      ...keyResultView,
      user: user.id,
    }

    const createdKeyResultView = await this.objectiveAggregateService.createKeyResultView(
      keyResultBindedWithUser,
    )

    return createdKeyResultView
  }
}

export default KeyResultViewsService
