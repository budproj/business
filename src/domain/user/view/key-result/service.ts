import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { uniq } from 'lodash'
import { SelectQueryBuilder } from 'typeorm'

import { CONSTRAINT } from 'src/domain/constants'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainEntityService from 'src/domain/service'
import { TeamDTO } from 'src/domain/team/dto'
import DomainTeamService from 'src/domain/team/service'
import { DomainServiceContext } from 'src/domain/types'
import { UserDTO } from 'src/domain/user/dto'
import DomainUserService from 'src/domain/user/service'

import { KeyResultViewDTO } from './dto'
import { KeyResultView } from './entities'
import DomainKeyResultViewRepository from './repository'

@Injectable()
class DomainKeyResultViewService extends DomainEntityService<KeyResultView, KeyResultViewDTO> {
  constructor(
    public readonly repository: DomainKeyResultViewRepository,
    @Inject(forwardRef(() => DomainUserService)) private readonly userService: DomainUserService,
    private readonly keyResultService: DomainKeyResultService,
    private readonly teamService: DomainTeamService,
  ) {
    super(repository, DomainKeyResultViewService.name)
  }

  async parseUserCompanyIDs(user: UserDTO) {
    const userCompanies = await this.teamService.getUserRootTeams(user)
    const userCompanyIDs = uniq(userCompanies.map((company) => company.id))

    return userCompanyIDs
  }

  async parseUserCompaniesTeamIDs(companyIDs: Array<TeamDTO['id']>) {
    const companiesTeams = await this.teamService.getAllTeamsBelowNodes(companyIDs)
    const companiesTeamIDs = uniq(companiesTeams.map((team) => team.id))

    return companiesTeamIDs
  }

  async getOneInQuery(
    query: SelectQueryBuilder<KeyResultView>,
    context: DomainServiceContext,
  ): Promise<KeyResultView | null> {
    const view = await query.getOne()
    if (!view) return

    const refreshedView = await this.refreshView(view, context.user)

    return refreshedView
  }

  async refreshView(view: KeyResultView, user: UserDTO) {
    const rank = await this.refreshViewRank(user, view?.rank)
    const newView = {
      ...view,
      rank,
    }

    const selector = { id: view.id }
    const newData = { rank }
    await this.update(selector, newData)

    return newView
  }

  async refreshViewRank(user: UserDTO, previousRank: KeyResultView['rank'] = []) {
    const availableKeyResults = await this.keyResultService.getFromOwner(user.id)
    const availableKeyResultIDs = availableKeyResults.map((keyResult) => keyResult.id)

    const rank = uniq([...previousRank, ...availableKeyResultIDs])

    return rank
  }

  async createIfUserIsInCompany(
    data: Partial<KeyResultView>,
    user: UserDTO,
    context: DomainServiceContext,
  ) {
    const selector = { id: data.userId }
    const targetUser = await this.userService.getOneWithConstraint(
      CONSTRAINT.COMPANY,
      selector,
      user,
    )
    if (!targetUser) return

    return this.create(data, context)
  }

  async createIfUserIsInTeam(
    data: Partial<KeyResultView>,
    user: UserDTO,
    context: DomainServiceContext,
  ) {
    const selector = { id: data.userId }
    const targetUser = await this.userService.getOneWithConstraint(CONSTRAINT.TEAM, selector, user)
    if (!targetUser) return

    return this.create(data, context)
  }

  async createIfUserOwnsIt(
    data: Partial<KeyResultView>,
    user: UserDTO,
    context: DomainServiceContext,
  ) {
    const selector = { id: data.userId }
    const targetUser = await this.userService.getOneWithConstraint(CONSTRAINT.OWNS, selector, user)
    if (!targetUser) return

    return this.create(data, context)
  }

  async create(userView: Partial<KeyResultViewDTO>, context: DomainServiceContext) {
    this.logger.debug({
      userView,
      context,
      message: 'Creating new key result view',
    })

    if (!userView.rank) userView.rank = await this.refreshViewRank(context.user)
    if (!userView.userId) userView.userId = context?.user.id

    const data = await this.repository.insert(userView)
    const createdViewsMetadata: Partial<KeyResultViewDTO[]> = data.raw
    if (!createdViewsMetadata || createdViewsMetadata.length === 0) return

    const createdViews = await Promise.all(
      createdViewsMetadata.map(async (viewMetadata) => this.getOne({ id: viewMetadata.id })),
    )

    return createdViews
  }
}

export default DomainKeyResultViewService
