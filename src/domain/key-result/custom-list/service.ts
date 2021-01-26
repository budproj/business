import { Injectable } from '@nestjs/common'
import { uniq } from 'lodash'

import { DomainEntityService, DomainQueryContext } from 'src/domain/entity'
import {
  KEY_RESULT_CUSTOM_LIST_BINDING,
  KEY_RESULT_CUSTOM_LIST_BINDING_NAMES,
} from 'src/domain/key-result/custom-list/constants'
import { KeyResult } from 'src/domain/key-result/entities'
import { UserDTO } from 'src/domain/user/dto'

import { KeyResultCustomListDTO } from './dto'
import { KeyResultCustomList } from './entities'
import DomainKeyResultCustomListRepository from './repository'

export interface DomainKeyResultCustomListServiceInterface {
  repository: DomainKeyResultCustomListRepository
}

export interface DomainKeyResultCustomListServiceInterface {
  refreshWithNewKeyResults: (
    keyResults: KeyResult[],
    keyResultCustomList?: KeyResultCustomListDTO,
  ) => Promise<KeyResultCustomList>
  createForBinding: (
    binding: KEY_RESULT_CUSTOM_LIST_BINDING,
    user: UserDTO,
    keyResults: KeyResult[],
  ) => Promise<KeyResultCustomList>
  getFromUser: (user: UserDTO) => Promise<KeyResultCustomList[]>
}

@Injectable()
class DomainKeyResultCustomListService extends DomainEntityService<
  KeyResultCustomList,
  KeyResultCustomListDTO
> {
  constructor(public readonly repository: DomainKeyResultCustomListRepository) {
    super(repository, DomainKeyResultCustomListService.name)
  }

  public async refreshWithNewKeyResults(
    keyResults: KeyResult[],
    keyResultCustomList?: KeyResultCustomListDTO,
  ) {
    const rank = this.buildRefreshedRank(keyResults, keyResultCustomList?.rank)
    const newData = { rank }

    const selector = { id: keyResultCustomList.id }
    const newCustomList = await this.update(selector, newData)

    return newCustomList
  }

  public async createForBinding(
    binding: KEY_RESULT_CUSTOM_LIST_BINDING,
    user: UserDTO,
    keyResults: KeyResult[],
  ) {
    const bindingBuilders = {
      [KEY_RESULT_CUSTOM_LIST_BINDING.MINE]: () => this.buildMineBindingList(user, keyResults),
    }

    const builder = bindingBuilders[binding]
    const data = builder()

    const createdData = await this.create(data)

    return createdData[0]
  }

  public async getFromUser(user: UserDTO) {
    const customLists = await this.getMany({ userId: user.id })

    return customLists
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

  private buildRefreshedRank(
    newKeyResults: KeyResult[],
    previousRank: KeyResultCustomList['rank'] = [],
  ) {
    const availableKeyResultIDs = this.buildRankFromKeyResults(newKeyResults)

    const rank = uniq([...previousRank, ...availableKeyResultIDs])

    return rank
  }

  private buildMineBindingList(user: UserDTO, keyResults: KeyResult[]) {
    const binding = KEY_RESULT_CUSTOM_LIST_BINDING.MINE
    const rank = this.buildRankFromKeyResults(keyResults)

    const customList = {
      binding,
      rank,
      title: KEY_RESULT_CUSTOM_LIST_BINDING_NAMES[binding],
      userId: user.id,
    }

    return customList
  }

  private buildRankFromKeyResults(keyResults: KeyResult[]) {
    return keyResults.map((keyResult) => keyResult.id)
  }
}

export default DomainKeyResultCustomListService
