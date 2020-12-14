import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { uniq } from 'lodash'
import { SelectQueryBuilder } from 'typeorm'

import { CONSTRAINT } from 'domain/constants'
import DomainKeyResultService from 'domain/key-result/service'
import DomainEntityService from 'domain/service'
import { DomainServiceContext } from 'domain/types'
import { UserDTO } from 'domain/user/dto'
import DomainUserService from 'domain/user/service'

import { KeyResultViewDTO } from './dto'
import { KeyResultView } from './entities'
import DomainKeyResultViewRepository from './repository'

@Injectable()
class DomainKeyResultViewService extends DomainEntityService<KeyResultView, KeyResultViewDTO> {
  constructor(
    public readonly repository: DomainKeyResultViewRepository,
    @Inject(forwardRef(() => DomainUserService)) private readonly userService: DomainUserService,
    private readonly keyResultService: DomainKeyResultService,
  ) {
    super(repository, DomainKeyResultViewService.name)
  }

  async getOneInQuery(
    query: SelectQueryBuilder<KeyResultView>,
    context: DomainServiceContext,
  ): Promise<KeyResultView | null> {
    const view = await query.getOne()
    const refreshedView = await this.refreshView(view, context)

    return refreshedView as KeyResultView
  }

  async refreshView(view: KeyResultView, context?: DomainServiceContext) {
    const availableKeyResults = await this.keyResultService.getManyWithConstraint(
      context.constraint,
      context.user,
    )
    const availableKeyResultIDs = availableKeyResults.map((keyResult) => keyResult.id.toString())
    const mergedRank = uniq([...view.rank, ...availableKeyResultIDs])

    const newView = {
      ...view,
      rank: mergedRank,
    }

    const selector = { id: view.id }
    const newData = { rank: mergedRank }
    await this.update(selector, newData as KeyResultView)

    return newView
  }

  async createIfUserIsInCompany(
    data: Partial<KeyResultView>,
    user: UserDTO,
  ): Promise<KeyResultView[] | null> {
    const selector = { id: data.userId }
    const keyResult = await this.userService.getOneWithConstraint(
      CONSTRAINT.COMPANY,
      selector,
      user,
    )
    if (!keyResult) return

    return this.create(data)
  }

  async createIfUserIsInTeam(
    data: Partial<KeyResultView>,
    user: UserDTO,
  ): Promise<KeyResultView[] | null> {
    const selector = { id: data.userId }
    const keyResult = await this.userService.getOneWithConstraint(CONSTRAINT.TEAM, selector, user)
    if (!keyResult) return

    return this.create(data)
  }

  async createIfUserOwnsIt(
    data: Partial<KeyResultView>,
    user: UserDTO,
  ): Promise<KeyResultView[] | null> {
    const selector = { id: data.userId }
    const keyResult = await this.userService.getOneWithConstraint(CONSTRAINT.OWNS, selector, user)
    if (!keyResult) return

    return this.create(data)
  }
}

export default DomainKeyResultViewService
