import { ACTION, RESOURCE, SCOPE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import { CompanyDTO } from 'domain/company/dto'
import DomainCompanyService from 'domain/company/service'
import { CycleDTO } from 'domain/cycle/dto'
import DomainCycleService from 'domain/cycle/service'
import { KeyResultDTO } from 'domain/key-result/dto'
import { ConfidenceReportDTO } from 'domain/key-result/report/confidence/dto'
import DomainConfidenceReportService from 'domain/key-result/report/confidence/service'
import { ProgressReportDTO } from 'domain/key-result/report/progress/dto'
import DomainProgressReportService from 'domain/key-result/report/progress/service'
import DomainKeyResultService from 'domain/key-result/service'
import { ObjectiveDTO } from 'domain/objective/dto'
import DomainObjectiveService from 'domain/objective/service'
import { TeamDTO } from 'domain/team/dto'
import DomainTeamService from 'domain/team/service'
import { UserDTO } from 'domain/user/dto'
import DomainUserService from 'domain/user/service'
import { KeyResultViewDTO } from 'domain/user/view/key-result/dto'
import DomainKeyResultViewService from 'domain/user/view/key-result/service'

abstract class GraphQLEntityService<
  S extends
    | DomainUserService
    | DomainKeyResultViewService
    | DomainTeamService
    | DomainObjectiveService
    | DomainKeyResultService
    | DomainProgressReportService
    | DomainConfidenceReportService
    | DomainCycleService
    | DomainCompanyService,
  D extends
    | UserDTO
    | KeyResultViewDTO
    | TeamDTO
    | ObjectiveDTO
    | KeyResultDTO
    | ProgressReportDTO
    | ConfidenceReportDTO
    | CycleDTO
    | CompanyDTO
> {
  public readonly entityService: S
  public readonly resource: RESOURCE

  constructor(public readonly serviceResource: RESOURCE, public readonly domainEntityService: S) {
    this.resource = serviceResource
    this.entityService = domainEntityService
  }

  async getOneByIDWithActionScopeConstraint(
    id: UserDTO['id'],
    user: AuthzUser,
    action: ACTION = ACTION.READ,
  ) {
    const scopedConstrainedSelectors = {
      [SCOPE.ANY]: async () => this.entityService.getOneByID(id),
      [SCOPE.COMPANY]: async () => this.entityService.getOneByIDIfUserIsInCompany(id, user),
      [SCOPE.TEAM]: async () => this.entityService.getOneByIDIfUserIsInTeam(id, user),
      [SCOPE.OWNS]: async () => this.entityService.getOneByIDIfUserOwnsIt(id, user),
    }
    const scopeConstraint = user.scopes[this.resource][action]
    const constrainedSelector = scopedConstrainedSelectors[scopeConstraint]

    return constrainedSelector()
  }

  async updateByIDWithScopeConstraint(
    id: D['id'],
    newData: Partial<D>,
    user: AuthzUser,
    action: ACTION = ACTION.UPDATE,
  ) {
    const scopedConstrainedSetters = {
      [SCOPE.ANY]: async () => this.entityService.updateOneByID(id, newData),
      [SCOPE.COMPANY]: async () =>
        this.entityService.updateOneByIDIfUserIsInCompany(id, newData, user),
      [SCOPE.TEAM]: async () => this.entityService.updateOneByIDIfUserIsInTeam(id, newData, user),
      [SCOPE.OWNS]: async () => this.entityService.updateOneByIDIfUserOwnsIt(id, newData, user),
    }
    const scopeConstraint = user.scopes[this.resource][action]
    const constrainedSelector = scopedConstrainedSetters[scopeConstraint]

    return constrainedSelector()
  }

  async createWithScopeConstraint(
    data: Partial<D>,
    user: AuthzUser,
    action: ACTION = ACTION.CREATE,
  ) {
    const scopedConstrainedCreators = {
      [SCOPE.ANY]: async () => this.entityService.create(data),
      [SCOPE.COMPANY]: async () => this.entityService.createIfUserIsInCompany(data, user),
      [SCOPE.TEAM]: async () => this.entityService.createIfUserIsInTeam(data, user),
      [SCOPE.OWNS]: async () => this.entityService.createIfUserOwnsIt(data, user),
    }
    const scopeConstraint = user.scopes[this.resource][action]
    const constrainedSelector = scopedConstrainedCreators[scopeConstraint]

    return constrainedSelector()
  }
}

export default GraphQLEntityService
