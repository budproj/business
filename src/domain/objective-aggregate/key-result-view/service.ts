import { Injectable, Logger } from '@nestjs/common'

import { KeyResultView } from 'domain/objective-aggregate/key-result-view/entities'
import { User } from 'domain/user-aggregate/user/entities'

import { KeyResultViewDTO, KeyResultViewBinding } from './dto'
import KeyResultViewRepository from './repository'

@Injectable()
class KeyResultViewService {
  private readonly logger = new Logger(KeyResultViewService.name)

  constructor(private readonly repository: KeyResultViewRepository) {}

  async getUserViewWithBinding(
    userID: User['id'],
    viewBinding: KeyResultViewBinding,
  ): Promise<KeyResultViewDTO> {
    this.logger.debug(`Fetching user ${userID} custom "${viewBinding}" view rank`)

    const userView = await this.repository.selectViewForUserBinding(userID, viewBinding)
    this.logger.debug({
      userView,
      message: `Selected user ${userID} custom rank for view ${viewBinding}`,
    })

    return userView
  }

  async getUserViews(userID: User['id']): Promise<KeyResultViewDTO[]> {
    this.logger.debug(`Fetching user ${userID} views`)

    const userViews = await this.repository.selectViewsForUser(userID)
    this.logger.debug({
      userViews,
      message: `Selected user ${userID} views`,
    })

    return userViews
  }

  async create(keyResultView: Partial<KeyResultViewDTO>): Promise<KeyResultView> {
    const createdData = await this.repository.insert(keyResultView)

    return createdData.raw
  }
}

export default KeyResultViewService
