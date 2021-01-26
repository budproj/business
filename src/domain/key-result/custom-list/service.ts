import { Injectable } from '@nestjs/common'

import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'

import { KeyResultCustomListDTO } from './dto'
import { KeyResultCustomList } from './entities'
import DomainKeyResultCustomListRepository from './repository'

export interface DomainKeyResultCustomListServiceInterface {
  repository: DomainKeyResultCustomListRepository
}

@Injectable()
class DomainKeyResultCustomListService extends DomainEntityService<
  KeyResultCustomList,
  KeyResultCustomListDTO
> {
  constructor(public readonly repository: DomainKeyResultCustomListRepository) {
    super(repository, DomainKeyResultCustomListService.name)
  }

  protected async createIfUserIsInCompany(
    _data: Partial<KeyResultCustomList>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserIsInTeam(
    _data: Partial<KeyResultCustomList>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  protected async createIfUserOwnsIt(
    _data: Partial<KeyResultCustomList>,
    _queryContext: DomainQueryContext,
  ) {
    return {} as any
  }

  // Async getOneInQuery(
  //   query: SelectQueryBuilder<KeyResultCustomList>,
  //   context: DomainServiceContext,
  // ): Promise<KeyResultCustomList | null> {
  //   const view = await query
  //     .andWhere(`${KeyResultCustomList.name}.user_id = :userID`, { userID: context.user.id })
  //     .getOne()
  //   if (!view) return
  //
  //   const refreshedView = await this.refreshView(view, context.user)
  //
  //   return refreshedView
  // }
  //
  // async refreshView(view: KeyResultCustomList, user: UserDTO) {
  //   const rank = await this.refreshViewRank(user, view?.rank)
  //   const newView = {
  //     ...view,
  //     rank,
  //   }
  //
  //   const selector = { id: view.id }
  //   const newData = { rank }
  //   await this.update(selector, newData)
  //
  //   return newView
  // }
  //
  // async refreshViewRank(user: UserDTO, previousRank: KeyResultCustomList['rank'] = []) {
  //   const availableKeyResults = await this.keyResultService.getFromOwner(user.id)
  //   const availableKeyResultIDs = availableKeyResults.map((keyResult) => keyResult.id)
  //
  //   const rank = uniq([...previousRank, ...availableKeyResultIDs])
  //
  //   return rank
  // }
  //
  // async createIfUserIsInCompany(
  //   data: Partial<KeyResultCustomList>,
  //   user: UserDTO,
  //   context: DomainServiceContext,
  // ) {
  //   const selector = { id: data.userId }
  //   const targetUser = await this.userService.getOneWithConstraint(
  //     CONSTRAINT.COMPANY,
  //     selector,
  //     user,
  //   )
  //   if (!targetUser) return
  //
  //   return this.create(data, context)
  // }
  //
  // async createIfUserIsInTeam(
  //   data: Partial<KeyResultCustomList>,
  //   user: UserDTO,
  //   context: DomainServiceContext,
  // ) {
  //   const selector = { id: data.userId }
  //   const targetUser = await this.userService.getOneWithConstraint(CONSTRAINT.TEAM, selector, user)
  //   if (!targetUser) return
  //
  //   return this.create(data, context)
  // }
  //
  // async createIfUserOwnsIt(
  //   data: Partial<KeyResultCustomList>,
  //   user: UserDTO,
  //   context: DomainServiceContext,
  // ) {
  //   const selector = { id: data.userId }
  //   const targetUser = await this.userService.getOneWithConstraint(CONSTRAINT.OWNS, selector, user)
  //   if (!targetUser) return
  //
  //   return this.create(data, context)
  // }
  //
  // async create(userView: Partial<KeyResultCustomListDTO>, context: DomainServiceContext) {
  //   this.logger.debug({
  //     userView,
  //     context,
  //     message: 'Creating new key result view',
  //   })
  //
  //   if (!userView.rank) userView.rank = await this.refreshViewRank(context.user)
  //   if (!userView.userId) userView.userId = context?.user.id
  //
  //   const data = await this.repository.insert(userView)
  //   const createdViewsMetadata: Partial<KeyResultCustomListDTO[]> = data.raw
  //   if (!createdViewsMetadata || createdViewsMetadata.length === 0) return
  //
  //   const createdViews = await Promise.all(
  //     createdViewsMetadata.map(async (viewMetadata) => this.getOne({ id: viewMetadata.id })),
  //   )
  //
  //   return createdViews
  // }
}

export default DomainKeyResultCustomListService
