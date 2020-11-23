import { Injectable, Logger } from '@nestjs/common'

import { KeyResultViewDTO } from 'domain/objective-aggregate/key-result-view/dto'
import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { User } from 'domain/user-aggregate/user/entities'
import ResourceNotAllowed from 'errors/resource-not-allowed'

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
      user,
    }

    const createdKeyResultView = await this.objectiveAggregateService.createKeyResultView(
      keyResultBindedWithUser,
    )

    return createdKeyResultView
  }

  async updateOwnedKeyResultView(
    user: User,
    keyResultViewID: KeyResultViewDTO['id'],
    newData: Partial<KeyResultViewDTO>,
  ): Promise<KeyResultView> {
    const isViewFromUser = await this.objectiveAggregateService.isViewFromUser(
      keyResultViewID,
      user.id,
    )
    if (!isViewFromUser)
      throw new ResourceNotAllowed(`${KeyResultView.name}::${keyResultViewID}`, user.id)

    this.logger.log(
      `Validated that view ${keyResultViewID.toString()} belongs to user ${user.id.toString()}`,
    )
    const updatedKeyResultView = await this.objectiveAggregateService.updateKeyResultView(
      keyResultViewID,
      newData,
    )

    return updatedKeyResultView
  }
}

export default KeyResultViewsService
