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

    const refreshedView = await this.refreshView(view, context)

    return refreshedView
  }

  async refreshView(view: KeyResultView, context?: DomainServiceContext) {
    const availableKeyResultIDs = await this.getAvailableKeyResultIDs(context)
    const userRank = view?.rank ?? []

    const mergedRank = uniq([...userRank, ...availableKeyResultIDs])
    const newView = {
      ...view,
      rank: mergedRank,
    }

    const selector = { id: view.id }
    const newData = { rank: mergedRank }
    await this.update(selector, newData)

    return newView
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

    if (!userView.rank) userView.rank = await this.getAvailableKeyResultIDs(context)
    if (!userView.userId) userView.userId = context?.user.id

    const data = await this.repository.insert(userView)
    const createdViewsMetadata: Partial<KeyResultViewDTO[]> = data.raw
    if (!createdViewsMetadata || createdViewsMetadata.length === 0) return

    const createdViews = await Promise.all(
      createdViewsMetadata.map(async (viewMetadata) => this.getOne({ id: viewMetadata.id })),
    )

    return createdViews
  }

  async getAvailableKeyResultIDs(context?: DomainServiceContext) {
    const availableKeyResults = await this.keyResultService.getManyWithConstraint(
      context.constraint,
      context.user,
    )
    const availableKeyResultIDs = availableKeyResults.map((keyResult) => keyResult.id.toString())

    return availableKeyResultIDs
  }
}

export default DomainKeyResultViewService
