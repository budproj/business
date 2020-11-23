import { Injectable, Logger } from '@nestjs/common'

import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'

@Injectable()
class KeyResultViewsService {
  private readonly logger = new Logger(KeyResultViewsService.name)

  constructor(private readonly objectiveAggregateService: ObjectiveAggregateService) {}

  async getViewsForUser(user: User): Promise<KeyResultView[]> {
    const views = await this.objectiveAggregateService.getUserViews(user.id)

    return views
  }
}

export default KeyResultViewsService
