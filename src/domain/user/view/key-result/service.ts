import { forwardRef, Inject, Injectable } from '@nestjs/common'

import DomainEntityService from 'domain/service'
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
  ) {
    super(repository, DomainKeyResultViewService.name)
  }

  async createIfUserIsInCompany(
    data: Partial<KeyResultView>,
    user: UserDTO,
  ): Promise<KeyResultView[] | null> {
    const selector = { id: data.userId }
    const keyResult = await this.userService.getOneIfUserIsInCompany(selector, user)
    if (!keyResult) return

    return this.create(data)
  }

  async createIfUserIsInTeam(
    data: Partial<KeyResultView>,
    user: UserDTO,
  ): Promise<KeyResultView[] | null> {
    const selector = { id: data.userId }
    const keyResult = await this.userService.getOneIfUserIsInTeam(selector, user)
    if (!keyResult) return

    return this.create(data)
  }

  async createIfUserOwnsIt(
    data: Partial<KeyResultView>,
    user: UserDTO,
  ): Promise<KeyResultView[] | null> {
    const selector = { id: data.userId }
    const keyResult = await this.userService.getOneIfUserOwnsIt(selector, user)
    if (!keyResult) return

    return this.create(data)
  }
}

export default DomainKeyResultViewService
