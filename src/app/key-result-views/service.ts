import { Injectable } from '@nestjs/common'

import { KeyResultViewDTO } from 'domain/objective-aggregate/key-result-view/dto'
import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import ObjectiveAggregateService from 'domain/objective-aggregate/service'
import { UserDTO } from 'domain/user-aggregate/user/dto'
import { User } from 'domain/user-aggregate/user/entities'

@Injectable()
class KeyResultViewsService {
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

  async isViewFromUser(
    keyResultViewID: KeyResultViewDTO['id'],
    userID: UserDTO['id'],
  ): Promise<boolean> {
    const isViewFromUser = await this.objectiveAggregateService.isViewFromUser(
      keyResultViewID,
      userID,
    )

    return isViewFromUser
  }

  async updateKeyResultView(
    keyResultViewID: KeyResultViewDTO['id'],
    newData: Partial<KeyResultViewDTO>,
  ): Promise<KeyResultView> {
    const updatedKeyResultView = await this.objectiveAggregateService.updateKeyResultView(
      keyResultViewID,
      newData,
    )

    return updatedKeyResultView
  }
}

export default KeyResultViewsService
