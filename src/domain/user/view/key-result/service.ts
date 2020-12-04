import { Injectable } from '@nestjs/common'

import DomainEntityService from 'domain/service'
import { UserDTO } from 'domain/user/dto'
import { KeyResultViewBinding } from 'domain/user/view/key-result/types'

import { KeyResultViewDTO } from './dto'
import { KeyResultView } from './entities'
import DomainKeyResultViewRepository from './repository'

@Injectable()
class DomainKeyResultViewService extends DomainEntityService<KeyResultView, KeyResultViewDTO> {
  constructor(public readonly repository: DomainKeyResultViewRepository) {
    super(repository, DomainKeyResultViewService.name)
  }

  async getOneByBinding(binding: KeyResultViewBinding): Promise<KeyResultView[] | null> {
    return this.repository.find({ binding })
  }

  async getOneByBindingIfUserIsInCompany(
    binding: KeyResultViewBinding,
    user: UserDTO,
  ): Promise<KeyResultView[] | null> {
    const userCompanies = await this.parseUserCompanies(user)

    this.logger.debug({
      userCompanies,
      user,
      message: `Reduced companies for user`,
    })

    const data = await this.repository.findByBindingWithCompanyConstraint(binding, userCompanies)

    return data
  }

  async getOneByBindingIfUserIsInTeam(
    binding: KeyResultViewBinding,
    user: UserDTO,
  ): Promise<KeyResultView[] | null> {
    const userTeams = await this.parseUserTeams(user)

    this.logger.debug({
      userTeams,
      user,
      message: `Reduced teams for user`,
    })

    const data = await this.repository.findByBindingWithTeamConstraint(binding, userTeams)

    return data
  }

  async getOneByBindingIfUserOwnsIt(
    binding: KeyResultViewBinding,
    user: UserDTO,
  ): Promise<KeyResultView | null> {
    const data = await this.repository.findByBindingWithOwnsConstraint(binding, user.id)

    return data
  }

  async updateRankIfUserOwnsIt(
    id: KeyResultViewDTO['id'],
    newRank: KeyResultViewDTO['rank'],
    user: UserDTO,
  ): Promise<KeyResultView | null> {
    const newData = {
      rank: newRank,
    }
    const conditions = {
      id,
      userId: user.id,
    }

    return this.repository.updateWithConditions(newData, conditions)
  }

  async create(
    keyResultViews: Partial<KeyResultViewDTO> | Array<Partial<KeyResultViewDTO>>,
  ): Promise<KeyResultView[]> {
    const data = await this.repository.insert(keyResultViews)

    return data.raw
  }
}

export default DomainKeyResultViewService
