import { RESOURCE, SCOPE } from 'app/authz/constants'
import { AuthzUser } from 'app/authz/types'
import DomainCompanyService from 'domain/company/service'
import DomainCycleService from 'domain/cycle/service'
import DomainConfidenceReportService from 'domain/key-result/report/confidence/service'
import DomainProgressReportService from 'domain/key-result/report/progress/service'
import DomainKeyResultService from 'domain/key-result/service'
import DomainObjectiveService from 'domain/objective/service'
import DomainTeamService from 'domain/team/service'
import { UserDTO } from 'domain/user'
import DomainUserService from 'domain/user/service'
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
    | DomainCompanyService
> {
  public readonly entityService: S
  public readonly resource: RESOURCE

  constructor(public readonly serviceResource: RESOURCE, public readonly domainEntityService: S) {
    this.resource = serviceResource
    this.entityService = domainEntityService
  }

  async getOneByIDWithScopeConstraint(id: UserDTO['id'], user: AuthzUser) {
    const scopedConstrainedSelectors = {
      [SCOPE.ANY]: async () => this.entityService.getOneByID(id),
      [SCOPE.COMPANY]: async () => this.entityService.getOneByIDIfUserIsInCompany(id, user),
      [SCOPE.TEAM]: async () => this.entityService.getOneByIDIfUserIsInTeam(id, user),
      [SCOPE.OWNS]: async () => this.entityService.getOneByIDIfUserOwnsIt(id, user),
    }
    const scopeConstraint = user.scopes[this.resource]
    const constrainedSelector = scopedConstrainedSelectors[scopeConstraint]

    return constrainedSelector()
  }
}

export default GraphQLEntityService
